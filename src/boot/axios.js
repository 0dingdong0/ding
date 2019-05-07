import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('auth_access_token')}`
axios.interceptors.request.use(request => {
  request.headers['Authorization'] = `Bearer ${localStorage.getItem('auth_access_token')}`
  return request
})

/**
 * Creates an authentication refresh interceptor that binds to any error response.
 * If the response code is 401, interceptor tries to call the refreshTokenCall which must return a Promise.
 * While refreshTokenCall is running, all new requests are intercepted and waiting for it to resolve.
 * After Promise is resolved/rejected the authentication refresh interceptor is revoked.
 * @param {AxiosInstance|Function} axios - axios instance
 * @param {Function} refreshTokenCall - refresh token call which must return a Promise
 * @param {Array} statusCodes - Response Code when authorization failed
 * @return {AxiosInstance}
 */
function bindAuthRefreshInterceptor(axios, refreshTokenCall, router, statusCodes = [401]) {
  let refreshCall

  const id = axios.interceptors.response.use(res => res, error => {
    // Reject promise if the error status is not in statusCodes
    if (!error.response || (error.response.status && statusCodes.indexOf(+error.response.status) === -1)) {
      return Promise.reject(error)
    }

    // Reject promise if a request for obtaining access token was failed
    if (error.response && error.response.config &&
      error.response.config.method.toLowerCase() === 'post' &&
      error.response.config.url.endsWith('/api/token/obtain/')) {
      return Promise.reject(error)
    }

    // other simultaneous authorization failed requests will be retried
    // after refreshCall is resolved
    if (refreshCall) {
      return refreshCall.then((response) => {
        error.response.config.headers['Authorization'] = 'Bearer ' + response.data.access
        return axios(error.response.config)
      })
    }

    // Remove the interceptor to prevent a loop
    // in case token refresh also causes the 401
    axios.interceptors.response.eject(id)
    refreshCall = refreshTokenCall(error)

    // Create interceptor that will bind all the others requests
    // until refreshTokenCall is resolved
    const requestQueueInterceptorId = axios.interceptors
      .request
      .use(request => refreshCall.then(() => request))

    // When response code is 401 (Unauthorized), try to refresh the token.
    return refreshCall.then(() => {
      return axios(error.response.config)
    }).catch(error => {
      localStorage.removeItem('auth_access_token')
      router.go({ path: '/login' })
      return Promise.reject(error)
    }).finally(() => {
      axios.interceptors.request.eject(requestQueueInterceptorId)
      bindAuthRefreshInterceptor(axios, refreshTokenCall, router, statusCodes)
      refreshCall = undefined
    })
  })
  return axios
}

export default ({ Vue, store, router }) => {
  const refreshToken = (failedRequest) =>
    axios.post(store.state.auth.end_points.refresh_jwt, { refresh: localStorage.getItem('auth_refresh_token') })
      .then(response => {
        localStorage.setItem('auth_access_token', response.data.access)
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + response.data.access
        return Promise.resolve(response)
      })

  bindAuthRefreshInterceptor(axios, refreshToken, router)

  store.$axios = axios
  Vue.prototype.$axios = axios
}

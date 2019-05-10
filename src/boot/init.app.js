import errors from 'src/errors.js'
import { GET_CURRENT_ACCOUNT } from '../store/modules/action-types'
import { UPDATE_CURRENT_ACCOUNT } from 'src/store/modules/mutation-types'

/*
 * 1) try to get and update user information(account and permissions).
 * 2) refresh access_token if it was expired
 * 3) delete auth tokens if rehresh_token was expired
 */

export default async ({ store, router }) => {
  const notify = (message, position = 'top', timeout = 3000, color = 'red') => {
    router.app.$q.notify({
      position: position,
      message: message,
      timeout: timeout,
      color: color,
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  return store
    .dispatch(`auth/${GET_CURRENT_ACCOUNT}`)
    .then(result => {
      store.commit(`auth/${UPDATE_CURRENT_ACCOUNT}`, result)
    })
    .catch(error => {
      let response = error.response
      if (response) {
        if (response.status === 401) {
          // auth_refresh_token was expired
          // absent tokens result in redirecting to '/login'
          localStorage.removeItem('auth_access_token')
          localStorage.removeItem('auth_refresh_token')
        } else if (response.status === 400) {
          // authentication was failed.
          // one reason is that auth tokens were deleted from localStorage
          // when auth_refresh_token was expired,
          // another reason is the first time the app to run, where there
          // are no auth token in localStorage.

          // here needs nothing to be done.
        }
      } else {
        if (error.message === errors.AUTH.TOKEN_ABSENT) {
          // nothing to do
          // absent tokens result in redirecting to '/login'
        } else if (error.message === 'Network Error') {
          // server is off
          const error_message = '服务器 暂时 离线， 请稍后再试！'
          console.log(error_message)
          setTimeout(() => {
            notify(error_message)
          }, 1000)
        } else {
          throw error
        }
      }
    })
}

import errors from 'src/errors.js'
import { GET_AND_UPDATE_CURRENT_ACCOUNT } from '../store/modules/action-types'

/*
 * 1) try to get and update user information(account and permissions).
 * 2) refresh access_token if it was expired
 * 3) delete auth tokens if rehresh_token was expired
 */

export default async ({ store, router }) => {
  return store
    .dispatch(`auth/${GET_AND_UPDATE_CURRENT_ACCOUNT}`)
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
        } else {
          throw error
        }
      }
    })
}

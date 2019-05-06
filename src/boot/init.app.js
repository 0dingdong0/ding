import * as homeModule from 'components/home'
import * as settingsModule from 'components/settings'
import {
  GET_AND_UPDATE_CURRENT_ACCOUNT
} from '../store/modules/action-types'

const modules = {
  [homeModule.config.name]: homeModule,
  [settingsModule.config.name]: settingsModule
}

// FIXME: infinate reboot by refresh token failed
export default async ({
  store,
  router
}) => {
  return store.dispatch(`auth/${GET_AND_UPDATE_CURRENT_ACCOUNT}`)
    .then((data) => {
      console.log(data)
    }).catch((error) => {
      let response = error.response
      if (response) {
        if (response.status === 401) {
          localStorage.removeItem('auth_access_token')
          localStorage.removeItem('auth_refresh_token')
        } else if (response.status === 400) {

        }
      } else {
        // TODO: Design Error System
        if (error.message === 'no access token found!') {

        } else {
          throw error
        }
      }
    }).finally(() => {
      let {
        routes
      } = router.options

      let routeData = routes.find(r => r.path === '/')

      for (let name in modules) {
        let mod = modules[name]
        routeData.children.push(mod.routes)
      }
      router.addRoutes([routeData])
    })
}

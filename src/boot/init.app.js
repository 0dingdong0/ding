import * as homeModule from 'components/home'
// import * as settingsModule from 'components/settings'
import { GET_AND_UPDATE_CURRENT_ACCOUNT } from '../store/modules/action-types'

// const modules = {
//   [homeModule.config.name]: homeModule,
//   [settingsModule.config.name]: settingsModule
// }

// FIXME: infinate reboot by refresh token failed
export default async ({ store, router }) => {
  let activeModules = localStorage.getItem('activeModules')
  activeModules && (activeModules = activeModules.split(','))
  activeModules || (activeModules = [homeModule.config.name])

  return store.dispatch(`auth/${GET_AND_UPDATE_CURRENT_ACCOUNT}`)
    .then((data) => {
      if (!data) {
        return
      }
      console.log(data)
      // console.log('vm', data)
      // let { account } = data
      // let { routes } = router.options
      // let routeData = routes.find(r => r.path === '/')

      // for (let name in modules) {
      //   let mod = modules[name]

      //   if (!store.getters['auth/hasPermission'](account, mod.config.permissions)) {
      //     let idx = activeModules.indexOf(mod.config.name)
      //     if (idx !== -1) {
      //       activeModules.splice(idx, 1)
      //     }
      //     continue
      //   }
      //   console.log('perm:', mod.config.name)
      //   if (routeData.children.indexOf(mod.routes) === -1) {
      //     routeData.children.push(mod.routes)
      //   }
      // }
      // router.addRoutes([routeData])
      // localStorage.setItem('activeModules', activeModules.join(','))
    }).catch((error) => {
      let response = error.response
      if (response && (response.status === 400 || response.status === 401)) {
        localStorage.removeItem('auth_access_token')
        localStorage.removeItem('auth_refresh_token')
      }
    }).finally(() => {
    })
}

import * as homeModule from 'components/home'
import * as settingsModule from 'components/settings'

// regist components here that needs to be displayed in 'layouts/MyLayout.vue'
const modules = {
  [homeModule.config.name]: homeModule,
  [settingsModule.config.name]: settingsModule
}

export default ({ router }) => {
  const { routes } = router.options
  const routeData = routes.find(r => r.path === '/')

  for (const name in modules) {
    const mod = modules[name]
    routeData.children.push(mod.routes)
  }

  router.addRoutes([routeData])
}

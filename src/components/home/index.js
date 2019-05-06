// 1. each component in one dir in 'scr/components'
// 2. register in 'src/boot/init.app.js'
// 3. register in 'src/layouts/MyLayout.vue'
const MODULE_NAME = 'home'

const routes = {
  path: MODULE_NAME,
  name: MODULE_NAME,
  components: {
    default: () => import('./index.vue'),
    menu: () => import('./menu.vue')
  }
}

const config = {
  name: MODULE_NAME,
  label: '首 页',
  icon: 'home',
  key: `${MODULE_NAME}_module`,
  // permissions:
  // valid: the name of isntalled apps from django side
  //     or in the same format of the orginal django permission
  // example: base.delete_account
  // permission checking will be executed in 'src/store/modules/auth.js'
  // empty means free accessing
  permissions: []
}

export { config, routes }

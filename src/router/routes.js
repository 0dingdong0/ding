const loginPath = {
  path: '/login',
  component: () => import('pages/auth/Login.vue'),
  children: [
    { path: '', component: () => import('pages/auth/LoginBackground') }
  ]
}

const rootPath = {
  path: '/',
  component: () => import('layouts/MyLayout.vue'),
  children: []
}

const routes = [loginPath, rootPath]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

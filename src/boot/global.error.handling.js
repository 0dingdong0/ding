export default ({ Vue, router }) => {
  const notify = (message, position = 'top', timeout = 3000, color = 'red') => {
    router.app.$q.notify({
      position: position,
      message: message,
      timeout: timeout,
      color: color,
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  Vue.config.errorHandler = (error, vm, info) => {
    console.error(error)
    console.log(info)
    notify(error.message)
  }

  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault()

    event.promise.catch(error => {
      if (error.response) {
        let response = error.response
        let method = error.response.config.method.toLowerCase()
        let url = error.response.config.url

        switch (error.response.status) {
          case 401:
            if (method === 'post' && url.endsWith('/api/token/obtain/')) {
              // login failed
              console.log(response.data.detail)
              notify('用户名 或 密码 错误 ！')
            } else if (method === 'post' && url.endsWith('/api/token/refresh/')) {
              notify('口令 刷新 失败 ！')
            } else {
              console.error(error)

            }
            break
          default:
            console.error(error)
            notify('unhandled [networking promise] rejections! see details in console.')
        }
      } else {
        console.error(error)
        notify('unhandled rejections! see details in console.')
      }
    })
  })
}

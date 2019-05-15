import { Loading } from 'quasar'
import notify from 'src/notify'

export default ({ Vue, router }) => {

  Vue.config.errorHandler = (error, vm, info) => {
    Loading.hide()
    console.error(error)
    console.log(info)
    notify.error(error.message)
  }

  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault()
    Loading.hide()
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
              notify.error('用户名 或 密码 错误 ！')
            } else if (method === 'post' && url.endsWith('/api/token/refresh/')) {
              notify.error('口令 刷新 失败 ！')
            } else {
              console.error(error)

            }
            break
          default:
            console.error(error)
            notify.error('unhandled [networking promise] rejections! see details in console.')
        }
      } else {
        console.error(error)
        notify.error('unhandled rejections! see details in console.')
      }
    })
  })
}

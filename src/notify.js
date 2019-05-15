import { Notify } from 'quasar'

export default {
  error: (message) => {
    Notify.create({
      message,
      position: 'top',
      timeout: 3000,
      textColor: 'white',
      color: 'red',
      actions: [{ icon: 'close', color: 'white' }]
    })
  },
  info: (message) => {
    Notify.create({
      message,
      position: 'center',
      timeout: 3000,
      textColor: 'white',
      color: 'primary',
      actions: [{ icon: 'close', color: 'white' }]
    })
  }
}

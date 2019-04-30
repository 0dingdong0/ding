import { UPDATE_TOKEN } from './mutation-types'
import { OBTAIN_TOKEN } from './action-types'

export default {
  namespaced: true,
  state: {
    end_points: {
      // TODO: Remove hardcoding of dev endpoints
      obtain_jwt: 'http://localhost:8000/api/token/obtain/',
      refresh_jwt: 'http://localhost:8000/api/token/refresh/',
      verify_jwt: 'http://localhost:8000/api/token/verify/'
    }
  },
  mutations: {
    [UPDATE_TOKEN] (state, token) {
      token.access && localStorage.setItem('auth_access_token', token.access)
      token.refresh && localStorage.setItem('auth_refresh_token', token.refresh)
    }
  },
  actions: {
    async [OBTAIN_TOKEN] ({ commit, state }, form) {
      let response = await this.$axios.post(state.end_points.obtain_jwt, form)
      commit(UPDATE_TOKEN, response.data)

      // return new Promise((resolve, reject) => {
      //   this.$axios
      //     .post(state.end_points.obtain_jwt, form)
      //     .then((response) => {
      //       commit(UPDATE_TOKEN, response.data)
      //       resolve()
      //     })
      //     .catch((err) => {
      //       console.log(err.response)

      //       let error = {}
      //       switch (err.response.status) {
      //         case 401: error.message = '用户名 或 密码 错误!'
      //           break
      //         default: error.message = '其它错误'
      //       }
      //       reject(error)
      //     })
      // })
    }
  },
  getters: {}
}

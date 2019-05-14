import errors from 'src/errors'

import {
  UPDATE_TOKEN,
  UPDATE_CURRENT_ACCOUNT,
  UPDATE_USER
} from './mutation-types'
import {
  OBTAIN_TOKEN,
  GET_CURRENT_ACCOUNT,
  SET_LOGIN_NAME,
  SET_PASSWORD,
  PATCH_USER
} from './action-types'

let server = process.env.API

export default {
  namespaced: true,
  state: {
    user: {},
    permissions: {},
    end_points: {
      obtain_jwt: `${server}/api/token/obtain/`,
      refresh_jwt: `${server}/api/token/refresh/`,
      verify_jwt: `${server}/api/token/verify/`,
      get_current_account: `${server}/api/base/accounts/current_account`
    }
  },
  mutations: {
    [UPDATE_TOKEN](state, token) {
      token.access && localStorage.setItem('auth_access_token', token.access)
      token.refresh && localStorage.setItem('auth_refresh_token', token.refresh)
    },
    [UPDATE_CURRENT_ACCOUNT](state, data) {
      state.user = {
        ...state.user,
        ...data.account
      }
      state.permissions = {
        ...state.permissions,
        ...data.permissions
      }
    },
    [UPDATE_USER](state, data) {
      state.user = {
        ...state.user,
        ...data
      }
    }
  },
  actions: {
    async [OBTAIN_TOKEN]({ commit, state }, form) {
      let response = await this.$axios.post(state.end_points.obtain_jwt, form)
      commit(UPDATE_TOKEN, response.data)
    },
    async [GET_CURRENT_ACCOUNT]({ commit, state }) {
      if (!localStorage.getItem('auth_access_token')) {
        throw Error(errors.AUTH.TOKEN_ABSENT)
      }
      let response = await this.$axios.get(state.end_points.get_current_account)
      // console.log('action', response.data)

      let permissions = {}
      for (let item of response.data.permissions) {
        // mod is app in server
        let [mod, perm] = item.split('.')
        if (!(mod in permissions)) {
          permissions[mod] = []
        }
        permissions[mod].push(perm)
      }

      let account = response.data.account

      return {
        account,
        permissions
      }
    },
    async [PATCH_USER]({ commit, state }, form) {
      let response = await this.$axios.patch(state.user.url, form)
      return response.data
    },
    async [SET_PASSWORD]({ commit, state }, form) {
      await this.$axios.patch(`${state.user.url}set_password/`, form)
    },
    async [SET_LOGIN_NAME]({ commit, state }, form) {
      let response = await this.$axios.patch(`${state.user.url}set_login_name/`, form)
      return response.data
    }
  },
  getters: {
    hasPermission: state => permissions => {
      if (state.user.is_superuser) {
        return true
      }

      if (permissions.length === 0) {
        return true
      }

      for (let perm in permissions) {
        // mod is app in server
        let [mod, action] = perm.split('.')

        if (mod in state.permissions) {
          if (action) {
            if (state.permissions[mod].indexOf(action) === -1) {
              return false
            }
          } else {
            continue
          }
        } else {
          return false
        }
      }
      return true
    }
  }
}

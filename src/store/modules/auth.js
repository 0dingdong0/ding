import errors from 'src/errors'

import {
  UPDATE_TOKEN,
  UPDATE_CURRENT_ACCOUNT
} from './mutation-types'
import {
  OBTAIN_TOKEN,
  GET_AND_UPDATE_CURRENT_ACCOUNT
} from './action-types'

// TODO: Remove hardcoding of dev server
let server = 'http://localhost:8000'

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
    }
  },
  actions: {
    async [OBTAIN_TOKEN]({ commit, state }, form) {
      let response = await this.$axios.post(state.end_points.obtain_jwt, form)
      commit(UPDATE_TOKEN, response.data)
    },
    async [GET_AND_UPDATE_CURRENT_ACCOUNT]({ commit, state }) {
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

      commit(UPDATE_CURRENT_ACCOUNT, {
        account: account,
        permissions
      })

      return {
        account,
        permissions
      }
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

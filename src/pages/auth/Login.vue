<template>
  <div class="login">
    <div class="login-form">
      <div class="login-form-input-fields">
        <q-input v-model="form.username"
                 dark clearable dense
                 type="text"
                 label="帐号"
                 maxlength="50"
                 color="blue-grey-3"
                 input-class="text-center">
          <template v-slot:before>
            <q-icon name="person" size="2rem" />
          </template>
        </q-input>
        <q-input v-model="form.password"
                 dark clearable dense
                 label="密码"
                 color="blue-grey-3"
                 input-class="text-center"
                 :type="ui.isPwd ? 'password' : 'text'">
          <template v-slot:before>
            <q-icon name="vpn_key" size="2rem" />
          </template>
          <template v-slot:append>
            <q-icon class="cursor-pointer"
                    :name="ui.isPwd ? 'visibility_off' : 'visibility'"
                    @click="ui.isPwd = !ui.isPwd" />
          </template>
        </q-input>
      </div>
      <br >
      <q-btn flat unelevated
             icon-right="send"
             color="grey"
             text-color="lightgrey"
             label="Login"
             :loading="ui.loading"
             @click="submit" />
    </div>
    <div class="login-background">
      <router-view />
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import {
  OBTAIN_TOKEN,
  GET_CURRENT_ACCOUNT
} from 'src/store/modules/action-types'
import { UPDATE_CURRENT_ACCOUNT } from 'src/store/modules/mutation-types'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      ui: {
        loading: false,
        isPwd: true
      }
    }
  },
  validations: {
    form: {
      username: { required },
      password: { required }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    submit() {
      this.ui.loading = true
      this.$q.loading.show()

      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.ui.loading = false
        throw new Error('用户名 和 密码 不能为空 ！')
      }
      this.$store
        .dispatch(`auth/${OBTAIN_TOKEN}`, this.form)
        .then(() => {
          return this.$store.dispatch(`auth/${GET_CURRENT_ACCOUNT}`)
        })
        .then(result => {
          this.$store.commit(`auth/${UPDATE_CURRENT_ACCOUNT}`, result)
          this.$router.push('/')
        })
        .finally(() => {
          this.ui.loading = false
          // this.$q.loading.hide()
        })
    }
  }
}
</script>

<style scoped>
.login .login-background {
  z-index: -1000;
}
.login .login-form {
  position: absolute;
  color: white;
  /* background-color: lightblue; */
  z-index: 100;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login .login-form-input-fields {
  min-width: 260px;
  max-width: 360px;
}
.login div.row.q-field:nth-child(2) {
  margin-top: 1rem;
}
</style>

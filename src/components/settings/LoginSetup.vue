<template>
  <div class="column items-center q-pa-md">
    <q-card class="q-mb-md full-width" style="max-width:600px;">
      <q-card-section class="q-pa-sm">
        <div class="text-h6 text-center">
          更改 登录名称
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="row">
          <div class="col-sm-6 col-12 q-px-sm">
            <q-input v-model="username_form.username"
                     label="用户名"
                     bottom-slots
                     :error="$v.username_form.username.$error || errors.username_form.username_existed"
                     @input="errors.username_form.username_existed = false">
              <template v-slot:error>
                <span v-if="errors.username_form.username_existed">该用户名已存在</span>
                <span v-if="!$v.username_form.username.required">必 填 项</span>
              </template>
            </q-input>
          </div>
          <div class="col-sm-6 col-12 q-px-sm">
            <q-input v-model="username_form.password"
                     label="密 码"
                     bottom-slots
                     :type="ui.username_form.isPwd? 'password': 'text'"
                     :error="$v.username_form.password.$error || errors.username_form.password_failed"
                     @input="errors.username_form.password_failed = false">
              <template v-slot:append>
                <q-icon :name="ui.username_form.isPwd?'visibility_off':'visibility'"
                        class="cursor-pointer"
                        @click="ui.username_form.isPwd=!ui.username_form.isPwd"/>
              </template>
              <template v-slot:error>
                <span v-if="!$v.username_form.password.required">必 填 项</span>
                <span v-if="errors.username_form.password_failed">密码错误</span>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-sm row justify-around">
          <q-btn label="重 置"
                 glossy color="red"
                 style="width:100px;"
                 @click="reset_username_form"/>
          <q-btn label="保 存"
                 glossy color="primary"
                 style="width:100px;"
                 :loading="ui.username_form.loading_set_login_name"
                 @click="change_username" />
        </div>
      </q-card-section>
    </q-card>
    <q-card class="q-mb-md full-width" style="max-width:600px;">
      <q-card-section class="q-pa-sm">
        <div class="text-h6 text-center">
          更改 登录密码
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row">
          <div class="col-12 col-sm-6 q-px-sm">
            <q-input v-model="password_form.new_password"
                     label="新密码"
                     bottom-slots
                     :type="ui.password_form.isPwdNew? 'password': 'text'"
                     :error="$v.password_form.new_password.$error">
              <template v-slot:append>
                <q-icon :name="ui.password_form.isPwdNew?'visibility_off':'visibility'"
                        class="cursor-pointer"
                        @click="ui.password_form.isPwdNew=!ui.password_form.isPwdNew"/>
              </template>
              <template v-slot:error>
                <span v-if="!$v.password_form.new_password.required">必 填 项</span>
                <span v-if="!$v.password_form.new_password.sameAs">必须与下面的新密码一致</span>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6 q-px-sm">
            <q-input v-model="password_form.confirm_password"
                     label="确认新密码"
                     bottom-slots
                     :type="ui.password_form.isPwdConfirm? 'password': 'text'"
                     :error="$v.password_form.confirm_password.$error">
              <template v-slot:append>
                <q-icon :name="ui.password_form.isPwdConfirm?'visibility_off':'visibility'"
                        class="cursor-pointer"
                        @click="ui.password_form.isPwdConfirm=!ui.password_form.isPwdConfirm"/>
              </template>
              <template v-slot:error>
                <span v-if="!$v.password_form.confirm_password.required">必 填 项</span>
                <span v-if="!$v.password_form.confirm_password.sameAs">必须与上面的新密码一致</span>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6 q-px-sm">
            <q-input v-model="password_form.password"
                     label="旧密码"
                     bottom-slots
                     :type="ui.password_form.isPwd? 'password': 'text'"
                     :error="$v.password_form.password.$error||errors.password_form.password_failed"
                     @input="errors.password_form.password_failed = false">
              <template v-slot:append>
                <q-icon :name="ui.password_form.isPwd?'visibility_off':'visibility'"
                        class="cursor-pointer"
                        @click="ui.password_form.isPwd=!ui.password_form.isPwd"/>
              </template>
              <template v-slot:error>
                <span v-if="!$v.password_form.password.required">必 填 项</span>
                <span v-if="errors.password_form.password_failed">密码错误</span>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-sm row justify-around">
          <q-btn label="重 置"
                 glossy color="red"
                 style="width:100px;"
                 @click="reset_password_form" />
          <q-btn label="确 认"
                 glossy color="primary"
                 style="width:100px;"
                 :loading="ui.password_form.set_password"
                 @click="change_password" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import notify from 'src/notify'
import { required, sameAs } from 'vuelidate/lib/validators'
import { SET_LOGIN_NAME, SET_PASSWORD } from 'src/store/modules/action-types'
import { UPDATE_USER } from 'src/store/modules/mutation-types'

export default {
  data() {
    return {
      errors: {
        username_form: {
          username_existed: false,
          password_failed: false
        },
        password_form: {
          password_failed: false,
          passwords_inconsistent: false
        }
      },
      ui: {
        username_form: {
          loading_set_login_name: false,
          isPwd: true
        },
        password_form: {
          loading_set_password: false,
          isPwd: true,
          isPwdNew: true,
          isPwdConfirm: true
        }
      },
      username_form: {
        username: '',
        password: ''
      },
      password_form: {
        password: '',
        new_password: '',
        confirm_password: ''
      }
    }
  },
  validations: {
    username_form: {
      username: { required },
      password: { required }
    },
    password_form: {
      password: { required },
      new_password: {
        required,
        sameAs: sameAs('confirm_password')
      },
      confirm_password: {
        required,
        sameAs: sameAs('new_password')
      }
    }
  },
  created() {
    this.reset_username_form()
    this.reset_password_form()
  },
  methods: {
    reset_username_form() {
      this.username_form.username = this.$store.state.auth.user.username
      this.username_form.password = ''
      this.$v.username_form.$reset()
    },
    reset_password_form() {
      this.password_form.password = ''
      this.password_form.new_password = ''
      this.password_form.confirm_password = ''
      this.$v.password_form.$reset()
    },
    change_username() {
      this.$v.username_form.$touch()
      if (this.$v.username_form.$error) {
        return
      }
      this.ui.username_form.loading_set_login_name = true
      this.$store
        .dispatch(`auth/${SET_LOGIN_NAME}`, this.username_form)
        .then(data => {
          this.$store.commit(`auth/${UPDATE_USER}`, data)
          this.reset_username_form()
          notify.info('登录名 已更新')
        })
        .catch(error => {
          const response = error.response
          if (response && response.status === 409) {
            console.log(response.data)
            this.errors.username_form.username_existed = true
          } else if (response && response.status === 405) {
            console.log(response.data)
            this.errors.username_form.password_failed = true
          }
        })
        .finally(() => {
          this.ui.username_form.loading_set_login_name = false
        })
    },
    change_password() {
      this.$v.password_form.$touch()
      if (this.$v.password_form.$error) {
        return
      }

      this.ui.password_form.loading_set_password = true
      this.$store
        .dispatch(`auth/${SET_PASSWORD}`, this.password_form)
        .then(data => {
          this.reset_password_form()
          notify.info('密码已更新')
        })
        .catch(error => {
          const response = error.response
          if (response && response.status === 405) {
            console.log(response.data)
            this.errors.password_form.password_failed = true
          } else if (response && response.status === 400) {
            console.log(response.data)
            this.errors.password_form.passwords_inconsistent = true
          }
        })
        .finally(() => {
          this.ui.password_form.loading_set_password = false
        })
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="row justify-center">
    <div style="min-width:260px; max-width:380px;">
      <q-tabs v-model="currentTab"
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="left">
        <q-tab name="userAndEmail" label="用户名 和 邮箱" />
        <q-tab name="changePassword" label="密码" />
      </q-tabs>
      <q-tab-panels v-model="currentTab">
        <q-tab-panel class="q-pa-none" name="userAndEmail">
          <q-input v-model="username_email_form.username"
                   label="用户名"
                   bottom-slots
                   :error="$v.username_email_form.username.$error || ui.errors.username_existed"
                   @input="ui.errors.username_existed = false">
            <template v-slot:error>
              <span v-if="ui.errors.username_existed">该用户名已存在</span>
              <span v-if="!$v.username_email_form.username.required">必 填 项</span>
            </template>
          </q-input>
          <q-input v-model="username_email_form.email"
                   label="邮箱"
                   bottom-slots
                   :error="$v.username_email_form.email.$error">
            <template v-slot:error>
              <span v-if="!$v.username_email_form.email.required">必 填 项</span>
              <span v-if="!$v.username_email_form.email.email">Email 格式 不正确</span>
            </template>
          </q-input>
          <div class="q-pa-md q-gutter-sm row justify-around">
            <q-btn label="重 置"
                   glossy color="red"
                   style="width:100px;"
                   @click="reset_username_email_form"/>
            <q-btn label="保 存"
                   glossy color="primary"
                   style="width:100px;"
                   :loading="ui.loading_username_and_email"
                   @click="save_user_name_email" />
          </div>
        </q-tab-panel>
        <q-tab-panel class="q-pa-none" name="changePassword">
          <q-input v-model="password_form.password"
                   label="旧密码"
                   bottom-slots
                   :type="ui.isPwd? 'password': 'text'"
                   :error="$v.password_form.password.$error||ui.errors.password_failed"
                   @input="ui.errors.password_failed = false">
            <template v-slot:append>
              <q-icon :name="ui.isPwd?'visibility_off':'visibility'"
                      class="cursor-pointer"
                      @click="ui.isPwd=!ui.isPwd"/>
            </template>
            <template v-slot:error>
              <span v-if="!$v.password_form.password.required">必 填 项</span>
              <span v-if="ui.errors.password_failed">密码错误</span>
            </template>
          </q-input>
          <q-input v-model="password_form.new_password"
                   label="新密码"
                   bottom-slots
                   :type="ui.isPwdNew? 'password': 'text'"
                   :error="$v.password_form.new_password.$error">
            <template v-slot:append>
              <q-icon :name="ui.isPwdNew?'visibility_off':'visibility'"
                      class="cursor-pointer"
                      @click="ui.isPwdNew=!ui.isPwdNew"/>
            </template>
            <template v-slot:error>
              <span v-if="!$v.password_form.new_password.required">必 填 项</span>
              <span v-if="!$v.password_form.new_password.sameAs">必须与下面的新密码一致</span>
            </template>
          </q-input>
          <q-input v-model="password_form.confirm_password"
                   label="确认新密码"
                   bottom-slots
                   :type="ui.isPwdConfirm? 'password': 'text'"
                   :error="$v.password_form.confirm_password.$error">
            <template v-slot:append>
              <q-icon :name="ui.isPwdConfirm?'visibility_off':'visibility'"
                      class="cursor-pointer"
                      @click="ui.isPwdConfirm=!ui.isPwdConfirm"/>
            </template>
            <template v-slot:error>
              <span v-if="!$v.password_form.confirm_password.required">必 填 项</span>
              <span v-if="!$v.password_form.confirm_password.sameAs">必须与上面的新密码一致</span>
            </template>
          </q-input>
          <div class="q-pa-md q-gutter-sm row justify-around">
            <q-btn label="重 置"
                   glossy color="red"
                   style="width:100px;"
                   @click="reset_password_form" />
            <q-btn label="确 认"
                   glossy color="primary"
                   style="width:100px;"
                   :loading="ui.loading_set_password"
                   @click="save_new_password" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import { required, email, sameAs } from 'vuelidate/lib/validators'
import { PATCH_USER, SET_PASSWORD } from 'src/store/modules/action-types'
import { UPDATE_USER } from 'src/store/modules/mutation-types'

export default {
  data() {
    return {
      currentTab: 'userAndEmail',
      ui: {
        errors: {
          username_existed: false,
          password_failed: false,
          passwords_inconsistent: false
        },
        loading_set_password: false,
        loading_username_and_email: false,
        isPwd: true,
        isPwdNew: true,
        isPwdConfirm: true
      },
      username_email_form: {
        username: '',
        email: ''
      },
      password_form: {
        password: '',
        new_password: '',
        confirm_password: ''
      }
    }
  },
  validations: {
    username_email_form: {
      username: { required },
      email: { required, email }
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
    this.reset_username_email_form()
    this.reset_password_form()
  },
  methods: {
    reset_username_email_form() {
      this.username_email_form.username = this.$store.state.auth.user.username
      this.username_email_form.email = this.$store.state.auth.user.email
    },
    reset_password_form() {
      this.password_form.password = ''
      this.password_form.new_password = ''
      this.password_form.confirm_password = ''
    },
    save_user_name_email() {
      this.$v.username_email_form.$touch()
      if (this.$v.username_email_form.$error) {
        return
      }
      this.ui.loading_username_and_email = true
      this.$store
        .dispatch(`auth/${PATCH_USER}`, this.username_email_form)
        .then(data => {
          this.$store.commit(`auth/${UPDATE_USER}`, data)
        })
        .catch(error => {
          const response = error.response
          if (response && response.status === 400) {
            console.log(response.data)
            this.ui.errors.username_existed = true
          }
        })
        .finally(() => {
          this.ui.loading_username_and_email = false
        })
    },
    save_new_password() {
      this.$v.password_form.$touch()
      if (this.$v.password_form.$error) {
        return
      }

      this.ui.loading_set_password = true
      this.$store
        .dispatch(`auth/${SET_PASSWORD}`, this.password_form)
        .then(data => {
          this.$q.notify({
            position: 'center',
            color: 'primary',
            message: '密码已更新',
            action: [{ icon: 'close', color: 'white' }],
            timeout: 3000
          })
        })
        .catch(error => {
          console.log('password' in error.response.data)
          const response = error.response
          if (response && response.status === 400) {
            console.log(response.data)
            if ('password' in response.data) {
              this.ui.errors.password_failed = true
            } else if ('new_password' in response.data) {
              this.ui.errors.passwords_inconsistent = true
            }
          }
        })
        .finally(() => {
          this.ui.loading_set_password = false
        })
    }
  }
}
</script>

<style>
</style>

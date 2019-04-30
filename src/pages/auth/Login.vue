<template>
  <div class="login">
    <div class="login-form">
      <div class="login-form-input-fields">
        <q-input
          v-model="form.username"
          type="text"
          dark clearable
          float-label="帐号"
          color="blue-grey-3"
        />
        <q-input
          v-model="form.password"
          type="password"
          dark clearable
          float-label="密码"
          color="blue-grey-3"
        />
      </div>
      <br>
      <q-btn
        flat
        unelevated
        :loading="loading"
        icon-right="send"
        color="grey"
        text-color="lightgrey"
        label="Login"
        @click="submit"
      />
    </div>
    <div class="login-background">
      <router-view />
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { OBTAIN_TOKEN } from '../../store/modules/action-types'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  validations: {
    form: {
      username: { required },
      password: { required }
    }
  },
  computed: {},
  mounted () {},
  methods: {
    submit () {
      this.loading = true

      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify({
          position: 'center',
          message: 'Account password cannot be empty!',
          timeout: 1500,
          color: 'red',
          closeBtn: 'X'
        })
        this.loading = false
        return
      }
      let that = this
      this.$store
        .dispatch('auth/' + OBTAIN_TOKEN, this.form)
        .then((response) => {
          that.loading = false
          that.$router.push('/')
        })
        .catch(err => {
          that.loading = false
          that.$q.notify({
            position: 'center',
            message: err.message,
            timeout: 1000,
            color: 'red',
            closeBtn: 'X'
          })
        })
    }
  }
}
</script>

<style scoped>
.login .login-background{
    z-index:-1000;
}
.login .login-form{
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
</style>

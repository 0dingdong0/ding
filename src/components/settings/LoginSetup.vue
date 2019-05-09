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
          <q-input v-model="form.username" label="用户名" />
          <q-input v-model="form.email" label="邮箱" />
          <q-input v-model="form.passowrd" label="密码" />
          <div class="q-pa-md q-gutter-sm row justify-around">
            <q-btn label="重 置"
                   glossy color="red"
                   style="width:100px;"
                   @click="fill_with_defaults"/>
            <q-btn label="保 存"
                   glossy color="primary"
                   style="width:100px;" />
          </div>
        </q-tab-panel>
        <q-tab-panel class="q-pa-none" name="changePassword">
          <q-input v-model="form.password" label="旧密码" />
          <q-input v-model="form.newPassword" label="新密码" />
          <q-input v-model="form.confirmPassword" label="确认新密码" />
          <div class="q-pa-md q-gutter-sm row justify-around">
            <q-btn label="确 认"
                   glossy color="primary"
                   style="width:100px;" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'userAndEmail',
      form: {
        username: '',
        email: '',
        passowrd: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  created() {
    this.fill_with_defaults()
  },
  methods: {
    fill_with_defaults() {
      this.form.username = this.$store.state.auth.user.username
      this.form.email = this.$store.state.auth.user.email
      this.form.passowrd = ''
    }
  }
}
</script>

<style>
</style>

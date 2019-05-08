<template>
  <div class="row justify-center">
    <div style="min-width:260px; max-width:380px;">
      <div class="text-subtitle1">
        <span>基本信息：</span>
      </div>
      <div>
        <q-input v-model="form.username" label="用户名" />
        <q-input v-model="form.first_name" label="姓" />
        <q-input v-model="form.last_name" label="名" />
        <q-input v-model="form.email" label="Email" />
        <div class="q-pa-md q-gutter-sm row justify-around">
          <q-btn label="重 置"
                 glossy color="red"
                 style="width:100px;"
                 @click="fill_with_defaults"/>
          <q-btn label="保 存"
                 glossy color="primary"
                 style="width:100px;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        first_name: '',
        last_name: '',
        email: ''
      }
    }
  },
  created() {
    this.fill_with_defaults()
  },
  methods: {
    fill_with_defaults() {
      this.form.username = this.$store.state.auth.user.username
      this.form.first_name = this.$store.state.auth.user.first_name
      this.form.last_name = this.$store.state.auth.user.last_name
      this.form.email = this.$store.state.auth.user.email
    }
  }
}
</script>

<style>
</style>

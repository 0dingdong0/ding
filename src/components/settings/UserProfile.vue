<template>
  <div class="row justify-center">
    <div style="min-width:300px; max-width:480px;">
      <q-tabs v-model="currentTab"
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="left">
        <q-tab name="basics" label="基本信息" />
        <q-tab name="contacts" label="联系方式" />
      </q-tabs>
      <q-tab-panels v-model="currentTab">
        <q-tab-panel class="q-pa-none" name="basics">
          <div class="row ">
            <q-input v-model="form.first_name" label="姓" />
            <q-input v-model="form.last_name" label="名" />
          </div>
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
        <q-tab-panel class="q-pa-none" name="contacts">
          联系方式
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'basics',
      form: {
        first_name: '',
        last_name: ''
      }
    }
  },
  created() {
    this.fill_with_defaults()
  },
  methods: {
    fill_with_defaults() {
      this.form.first_name = this.$store.state.auth.user.first_name
      this.form.last_name = this.$store.state.auth.user.last_name
    }
  }
}
</script>

<style>
</style>

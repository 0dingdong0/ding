<template>
  <div class="row justify-center">
    <div style="min-width:300px; max-width:480px;">
      <q-tabs v-model="ui.currentTab"
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="left">
        <q-tab name="profileTab" label="基本信息" />
        <q-tab name="contacts" label="联系方式" />
      </q-tabs>
      <q-tab-panels v-model="ui.currentTab">
        <q-tab-panel class="q-pa-none" name="profileTab">
          <div class="row ">
            <q-input v-model="profileForm.last_name"
                     label="姓"
                     bottom-slots
                     :error="$v.profileForm.last_name.$error">
              <template v-slot:error>
                <span v-if="!$v.profileForm.last_name.required">必 填 项</span>
              </template>
            </q-input>
            <q-input v-model="profileForm.first_name"
                     label="名"
                     bottom-slots
                     :error="$v.profileForm.first_name.$error">
              <template v-slot:error>
                <span v-if="!$v.profileForm.first_name.required">必 填 项</span>
              </template>
            </q-input>
          </div>
          <div class="q-pa-md q-gutter-sm row justify-around">
            <q-btn label="重 置"
                   glossy color="red"
                   style="width:100px;"
                   @click="fill_with_defaults"/>
            <q-btn label="保 存"
                   glossy color="primary"
                   style="width:100px;"
                   :loading="ui.loading_patch_user"
                   @click="save_user_profile"/>
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
import { required } from 'vuelidate/lib/validators'
import { PATCH_USER } from 'src/store/modules/action-types'
import { UPDATE_USER } from 'src/store/modules/mutation-types'

export default {
  data() {
    return {
      ui: {
        currentTab: 'profileTab',
        loading_patch_user: false
      },
      profileForm: {
        first_name: '',
        last_name: ''
      }
    }
  },
  validations: {
    profileForm: {
      first_name: { required },
      last_name: { required }
    }
  },
  created() {
    this.fill_with_defaults()
  },
  methods: {
    fill_with_defaults() {
      this.profileForm.first_name = this.$store.state.auth.user.first_name
      this.profileForm.last_name = this.$store.state.auth.user.last_name
    },
    save_user_profile() {
      this.$v.profileForm.$touch()
      if (this.$v.profileForm.$error) {
        return
      }
      this.ui.loading_patch_user = true
      this.$store
        .dispatch(`auth/${PATCH_USER}`, this.profileForm)
        .then(data => {
          this.$store.commit(`auth/${UPDATE_USER}`, data)
        })
        .catch(error => {})
        .finally(() => {
          this.ui.loading_patch_user = false
        })
    }
  }
}
</script>

<style>
</style>

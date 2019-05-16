<template>
  <div class="column items-center q-pa-md">
    <q-card class="q-mb-md full-width" style="max-width:600px;">
      <q-card-section class="q-pa-sm">
        <div class="text-h6 text-center">
          基本信息
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="row">
          <div class="col-sm-6 col-12 q-px-sm">
            <q-input v-model="profileForm.last_name"
                     label="姓"
                     bottom-slots
                     :error="$v.profileForm.last_name.$error">
              <template v-slot:error>
                <span v-if="!$v.profileForm.last_name.required">必 填 项</span>
              </template>
            </q-input>
          </div>
          <div class="col-sm-6 col-12 q-px-sm">
            <q-input v-model="profileForm.first_name"
                     label="名"
                     bottom-slots
                     :error="$v.profileForm.first_name.$error">
              <template v-slot:error>
                <span v-if="!$v.profileForm.first_name.required">必 填 项</span>
              </template>
            </q-input>
          </div>
          <div class="col-sm-6 col-12 q-px-sm">
            <q-input v-model="profileForm.email"
                     label="Email"
                     bottom-slots
                     :error="$v.profileForm.email.$error">
              <template v-slot:error>
                <span v-if="!$v.profileForm.email.required">必 填 项</span>
              </template>
            </q-input>
          </div>
        </div>
        <div class="q-gutter-sm row justify-around">
          <q-btn label="重 置"
                 color="red"
                 style="width:100px;"
                 @click="reset_profile_form"/>
          <q-btn label="保 存"
                 color="primary"
                 style="width:100px;"
                 :loading="ui.loading_patch_user"
                 @click="save_user_profile"/>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="q-mb-md full-width" style="max-width:600px;">
      <q-card-section class="q-pa-sm">
        <div class="text-h6 text-center">
          联系方式
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div v-for="contact in contacts"
             :key="contact.id"
             class="row">
          <div class="col q-px-sm">
            <q-select v-model="contact.type"
                      dense
                      :options="ui.contact_types"
                      options-selected-class="text-deep-primary" >
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <!-- <q-item-label v-html="scope.opt.label" /> -->
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>
                      {{ scope.opt.description }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col q-px-sm">
            <q-input v-model="contact.value"
                     dense bottom-slots
                     :error="$v.profileForm.email.$error">
              <template v-slot:error>
                <span v-if="!$v.profileForm.email.required">必 填 项</span>
              </template>
            </q-input>
          </div>
          <div class="col q-px-sm">
            <q-btn-group flat>
              <q-btn icon="add"
                     dense />
              <q-btn icon="clear"
                     dense
                     :loading="ui.loading_patch" />
            </q-btn-group>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { PATCH_USER } from 'src/store/modules/action-types'
import { UPDATE_USER } from 'src/store/modules/mutation-types'

export default {
  data() {
    return {
      ui: {
        currentTab: 'profileTab',
        loading_patch_user: false,
        contact_types: [
          {
            label: 'Email',
            value: 'Email',
            icon: 'email',
            description: '工作'
          },
          { label: 'Mobile', value: 'Mobile', icon: 'map', description: '工作' }
        ]
      },
      profileForm: {
        first_name: '',
        last_name: '',
        email: ''
      },
      contacts: []
    }
  },
  validations: {
    profileForm: {
      first_name: { required },
      last_name: { required },
      email: { required, email }
    }
  },
  created() {
    this.reset_profile_form()

    this.contacts.push({
      id: '1',
      type: 'Email',
      value: this.$store.state.auth.user.email
    })
  },
  methods: {
    reset_profile_form() {
      this.profileForm.first_name = this.$store.state.auth.user.first_name
      this.profileForm.last_name = this.$store.state.auth.user.last_name
      this.profileForm.email = this.$store.state.auth.user.email
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

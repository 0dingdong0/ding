<template>
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
</template>

<script>
export default {
  data() {
    return {
      contacts: []
    }
  },

  created() {
    this.contacts.push({
      id: '1',
      type: 'Email',
      value: this.$store.state.auth.user.email
    })
  }
}
</script>

<style/>

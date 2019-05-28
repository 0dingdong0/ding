<template>
  <q-card class="q-mb-md full-width">
    <q-card-section class="q-pa-sm">
      <div class="text-h6 text-center">
        联系方式
      </div>
    </q-card-section>
    <q-separator inset />
    <q-card-section>
      <div v-for="(contact, idx) in contacts"
           :key="idx"
           class="row">
        <div class="col-3 q-px-sm">
          <q-select v-model="contact.type"
                    dense
                    :readonly="ui.readOnly[idx]"
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
                   :readonly="ui.readOnly[idx]"
                   dense/>
        </div>
        <div class="col-shrink q-px-sm">
          <q-btn-group flat>
            <q-btn icon="clear" dense
                   :loading="ui.loading_patch"
                   @click="removeContact(idx)" />
            <q-btn v-if="!ui.readOnly[idx]"
                   icon="done" dense
                   :loading="ui.loading_patch"
                   @click="addContact(idx)" />
            <q-btn v-if="ui.readOnly[idx]"
                   icon="edit" dense
                   :loading="ui.loading_patch"
                   @click="editContact(idx)" />
          </q-btn-group>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="q-gutter-sm row justify-around">
        <q-btn label="添 加"
               glossy color="primary"
               style="width:100px;"
               @click="new_contact" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
// import { required, email } from 'vuelidate/lib/validators'

export default {
  props: {
    contacts: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      ui: {
        readOnly: [],
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
      }
    }
  },

  created() {
    //JSON.parse(JSON.stringify(obj)) used to deep copy contacts
    this.ui.readOnly = Array(this.contacts.length).fill(true)
  },

  methods: {
    new_contact() {
      this.contacts.push({
        id: '',
        type: '',
        value: ''
      })
      this.ui.readOnly.push(false)
    },
    addContact(idx) {
      console.log('add contact:', this.contacts[idx])
    },
    removeContact(idx) {
      const contact = this.contacts[idx]
      if (contact.id) {
        this.$emit('removeContact', idx)
      } else {
        this.contacts.splice(idx, 1)
      }
    },
    editContact(idx) {}
  }
}
</script>

<style/>

<template>
  <q-list padding dense>
    <q-item v-ripple clickable @click="close()">
      <q-item-section avatar>
        <q-icon name="highlight_off" />
      </q-item-section>
      <q-item-section>
        <q-item-label>关 闭</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-expansion-item dense default-opened
                      icon="person" label="账 户">
      <q-item v-ripple clickable dense exact
              class="bg-grey-3"
              :to="{ name: 'login-setup' }"
              :inset-level="secondInsetLevel">
        <q-item-section>登录信息</q-item-section>
      </q-item>
      <q-item v-ripple clickable dense exact
              class="bg-grey-3"
              :to="{ name: 'user-profile' }"
              :inset-level="secondInsetLevel">
        <q-item-section>基本信息</q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { config } from 'components/settings'

export default {
  data() {
    return {
      secondInsetLevel: 1
    }
  },
  methods: {
    close: function() {
      this.$emit('close_module', config.name)
    }
  }
}
</script>

<style>
</style>

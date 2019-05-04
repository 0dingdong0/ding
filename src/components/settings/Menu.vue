<template>
  <q-list padding dense>
      <q-item clickable v-ripple @click="close()">
        <q-item-section avatar>
          <q-icon name="highlight_off"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>关 闭</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator/>
      <q-expansion-item
        dense
        icon="person"
        label="账 户"
        default-opened
      >
        <q-item clickable v-ripple dense
          :to="{name: 'user-profile'}" exact
          :inset-level=secondInsetLevel>
          <q-item-section>基本信息</q-item-section>
        </q-item>
        <q-item clickable v-ripple dense
          :to="{name: 'change-password'}" exact
          :inset-level=secondInsetLevel>
          <q-item-section>修改密码</q-item-section>
        </q-item>
      </q-expansion-item>
  </q-list>
</template>

<script>
import { config } from 'components/settings'

export default {
  data () {
    return {
      secondInsetLevel: 1
    }
  },
  methods: {
    close: function () {
      this.$emit('close_module', config.name)
    }
  }
}
</script>

<style>

</style>

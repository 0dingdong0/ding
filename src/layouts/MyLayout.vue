<template>
  <q-layout view="lHh Lpr lfr">
    <q-header elevated class="glossy no-wrap">
      <q-toolbar>
        <q-btn flat dense round
               aria-label="Menu"
               @click="ui.leftDrawerOpen = !ui.leftDrawerOpen">
          <q-icon v-if="ui.leftDrawerOpen" name="menu" />
          <q-icon v-if="!ui.leftDrawerOpen" name="more_vert" />
        </q-btn>

        <q-toolbar-title style="min-width:120px;">
          Quasar App
        </q-toolbar-title>

        <q-tabs v-model="ui.currentModule"
                inline-label dense shrink
                align="right"
                class="text-white self-end q-pr-md">
          <q-tab v-for="mod in ui.activeModules"
                 :key="mod.key"
                 :name="mod.name"
                 :icon="mod.icon"
                 :label="mod.label"
                 @click="activeModule(mod.name)" />
        </q-tabs>

        <q-btn flat dense round
               aria-label="Menu"
               @click="ui.rightDrawerOpen = !ui.rightDrawerOpen">
          <q-icon v-if="ui.rightDrawerOpen" name="menu" />
          <q-icon v-if="!ui.rightDrawerOpen" name="more_vert" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="ui.leftDrawerOpen" bordered
              content-class="bg-grey-2"
              :width="ui.leftDrawerWith">
      <!-- TODO:  remove usefulless items -->
      <q-img src="https://cdn.quasar-framework.org/img/material.png"
             class="absolute-top"
             style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar-framework.org/img/boy-avatar.png" >
          </q-avatar>
          <div class="text-weight-bold">
            {{ fullName }}
          </div>
          <div>@{{ loginName }}</div>
        </div>
      </q-img>
      <q-scroll-area
        style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item href="http://v1.quasar-framework.org"
                  clickable tag="a"
                  target="_blank">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Docs</q-item-label>
              <q-item-label caption>
                v1.quasar-framework.org
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item href="https://github.com/quasarframework/"
                  clickable tag="a"
                  target="_blank">
            <q-item-section avatar>
              <q-icon name="code" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Github</q-item-label>
              <q-item-label caption>
                github.com/quasarframework
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item href="http://chat.quasar-framework.org"
                  clickable tag="a"
                  target="_blank">
            <q-item-section avatar>
              <q-icon name="chat" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Discord Chat Channel</q-item-label>
              <q-item-label caption>
                chat.quasar-framework.org
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item href="https://forum.quasar-framework.org"
                  clickable tag="a"
                  target="_blank">
            <q-item-section avatar>
              <q-icon name="record_voice_over" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Forum</q-item-label>
              <q-item-label caption>
                forum.quasar-framework.org
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item href="https://twitter.com/quasarframework"
                  clickable tag="a"
                  target="_blank">
            <q-item-section avatar>
              <q-icon name="rss_feed" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Twitter</q-item-label>
              <q-item-label caption>
                @quasarframework
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item v-ripple clickable @click="activeModule('settings')">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>设置</q-item-label>
              <q-item-label caption>
                帐号, 基本信息 ...
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer v-model="ui.rightDrawerOpen"
              side="right"
              content-class="bg-grey-1"
              :width="ui.rightDrawerWith">
      <router-view name="menu" @close_module="closeModule" />
    </q-drawer>
    <q-footer class="bg-grey-1 text-black row justify-center q-pa-md">
      <div>Quasar v{{ $q.version }}</div>
    </q-footer>
  </q-layout>
</template>

<script>
import { config as homeModuleConfig } from 'components/home'
import { config as settingsModuleConfig } from 'components/settings'
import { openURL } from 'quasar'

const modules = {
  home: homeModuleConfig,
  settings: settingsModuleConfig
}

export default {
  name: 'MyLayout',
  data() {
    return {
      ui: {
        leftDrawerOpen: this.$q.platform.is.desktop,
        leftDrawerWith: 260,
        rightDrawerOpen: true,
        rightDrawerWith: 200,
        currentModule: undefined,
        activeModules: []
      }
    }
  },
  computed: {
    fullName() {
      const last_name = this.$store.state.auth.user.last_name
      const first_name = this.$store.state.auth.user.first_name
      return `${last_name} ${first_name}`
    },
    loginName() {
      return this.$store.state.auth.user.username
    }
  },
  beforeCreate() {
    console.log(this.$store.state.auth.permissions)
  },
  created() {
    let aMods = localStorage.getItem('activeModules')
    aMods && (aMods = aMods.split(','))
    aMods || (aMods = [homeModuleConfig.name])
    for (let aMod of aMods) {
      if (
        this.$store.getters['auth/hasPermission'](modules[aMod].permissions)
      ) {
        this.ui.activeModules.push(modules[aMod])
      }
    }

    if (this.$route.path === '/') {
      this.activeModule('home')
    } else {
      this.ui.currentModule = this.$route.path.split('/')[1]
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
  methods: {
    openURL,
    activeModule(name) {
      let mod = modules[name]
      if (this.ui.activeModules.indexOf(mod) === -1) {
        this.ui.activeModules.push(mod)
        localStorage.setItem(
          'activeModules',
          this.ui.activeModules.map(mod => mod.name).join(',')
        )
      }

      this.$router.push({ name: name }, () => {
        this.ui.currentModule = name
      })
    },
    closeModule(modName) {
      let idx = this.ui.activeModules.indexOf(modules[modName])

      if (idx < 1) {
        return
      }
      this.ui.activeModules.splice(idx, 1)
      localStorage.setItem(
        'activeModules',
        this.ui.activeModules.map(mod => mod.name).join(',')
      )

      let nextMod = this.ui.activeModules[--idx].name

      this.$router.push({ name: nextMod }, () => {
        this.ui.currentModule = nextMod
      })
    }
  }
}
</script>

<style>
</style>

<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated class="glossy no-wrap">
      <q-toolbar>
        <q-btn flat dense round @click="ui.leftDrawerOpen = !ui.leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" v-if="ui.leftDrawerOpen"/>
          <q-icon name="more_vert" v-if="!ui.leftDrawerOpen"/>
        </q-btn>

        <q-toolbar-title style="min-width:120px;">Quasar App</q-toolbar-title>

        <q-tabs
          v-model="ui.currentModule"
          inline-label
          dense
          shrink
          align="right"
          class="text-white self-end q-pr-md"
        >
          <q-tab
            v-for="mod in ui.activeModules"
            :key="mod.key"
            :name="mod.name"
            :icon="mod.icon"
            :label="mod.label"
            @click="activeModule(mod.name)"
          />
        </q-tabs>

        <q-btn flat dense round @click="ui.rightDrawerOpen = !ui.rightDrawerOpen" aria-label="Menu">
          <q-icon name="menu" v-if="ui.rightDrawerOpen"/>
          <q-icon name="more_vert" v-if="!ui.rightDrawerOpen"/>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="ui.leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
      :width="ui.leftDrawerWith"
    >
      <!-- TODO:  -->
      <q-img
        class="absolute-top"
        src="https://cdn.quasar-framework.org/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar-framework.org/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
        </div>
      </q-img>
      <q-scroll-area
        style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
      >
        <q-list padding>
          <q-item clickable tag="a" target="_blank" href="http://v1.quasar-framework.org">
            <q-item-section avatar>
              <q-icon name="school"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Docs</q-item-label>
              <q-item-label caption>v1.quasar-framework.org</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
            <q-item-section avatar>
              <q-icon name="code"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Github</q-item-label>
              <q-item-label caption>github.com/quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="http://chat.quasar-framework.org">
            <q-item-section avatar>
              <q-icon name="chat"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Discord Chat Channel</q-item-label>
              <q-item-label caption>chat.quasar-framework.org</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://forum.quasar-framework.org">
            <q-item-section avatar>
              <q-icon name="record_voice_over"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Forum</q-item-label>
              <q-item-label caption>forum.quasar-framework.org</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
            <q-item-section avatar>
              <q-icon name="rss_feed"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Twitter</q-item-label>
              <q-item-label caption>@quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator/>
          <q-item clickable v-ripple @click="activeModule('settings')">
            <q-item-section avatar>
              <q-icon name="settings"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>设置</q-item-label>
              <q-item-label caption>帐号, 基本信息 ...</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-drawer
      v-model="ui.rightDrawerOpen"
      side="right"
      content-class="bg-grey-1"
      :width="ui.rightDrawerWith"
    >
      <router-view name="menu" @close_module="closeModule"/>
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
  data () {
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
  beforeCreate () {
    console.log(this.$store.state.auth.permissions)
    // let { account } = data
    // let { routes } = router.options
    // let routeData = routes.find(r => r.path === '/')

    // for (let name in modules) {
    //   let mod = modules[name]

    //   if (!store.getters['auth/hasPermission'](account, mod.config.permissions)) {
    //     let idx = activeModules.indexOf(mod.config.name)
    //     if (idx !== -1) {
    //       activeModules.splice(idx, 1)
    //     }
    //     continue
    //   }
    //   console.log('perm:', mod.config.name)
    //   if (routeData.children.indexOf(mod.routes) === -1) {
    //     routeData.children.push(mod.routes)
    //   }
    // }
    // router.addRoutes([routeData])
    // localStorage.setItem('activeModules', activeModules.join(','))
  },
  created () {
    let aMods = localStorage.getItem('activeModules')
    aMods && (aMods = aMods.split(','))
    aMods || (aMods = [homeModuleConfig.name])
    for (let aMod of aMods) {
      if (this.$store.getters['auth/hasPermission'](modules[aMod].permissions)) {
        this.ui.activeModules.push(modules[aMod])
      }
    }

    if (this.$route.path === '/') {
      this.activeModule('home')
    } else {
      this.ui.currentModule = this.$route.path.split('/')[1]
    }
  },
  methods: {
    openURL,
    activeModule (name) {
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
    closeModule (modName) {
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

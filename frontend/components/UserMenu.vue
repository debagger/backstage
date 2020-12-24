<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" v-if="isLoggedIn">
        <v-avatar size="32">
          <v-img :src="$auth.user.picture" />
        </v-avatar>
      </v-btn>
      <v-btn icon v-on="on" v-else>
        <v-avatar size="32">
          <v-icon> mdi-account-circle </v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-list flat v-if="!isLoggedIn">
      <v-list-item @click="login()">
        <v-list-item-icon>
          <v-icon> mdi-login </v-icon>
        </v-list-item-icon>
        <v-list-item-title> Войти </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item>
        <v-list-item-avatar>
          <v-avatar size="32">
            <v-img :src="$auth.user.picture" />
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
        <v-list-item-title>{{ $auth.user.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ $auth.user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider/>
      <v-dialog width="500">
        <template v-slot:activator="{ on }">
          <v-list-item v-on="on">
            <v-list-item-icon>
              <v-icon>mdi-card-account-details</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
            <v-list-item-title>Профиль</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <user-profile />
      </v-dialog>
      <v-list-item @click="logout()">

        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Выход</v-list-item-title>  </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import UserProfile from '~/components/UserProfile.vue'
export default Vue.extend({
  components: { UserProfile },
  computed: {
    isLoggedIn() {
      return !!this.$auth?.isAuthenticated
    },
  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect({
        redirect_uri: 'http://localhost/',
        ui_locales: 'ru',
      })
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: 'http://localhost/',
      })
    },
  },
})
</script>

<style>
</style>
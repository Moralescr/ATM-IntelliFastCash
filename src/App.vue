<template>
  <v-app id="inspire">
    <v-navigation-drawer color="sideBar" v-model="drawer" :right="false" app>
      <!-- Navegar opciones -->
      <v-list-item>
        <v-list-item-avatar>
          <v-avatar color="userPhoto" size="40">AM</v-avatar>
        </v-list-item-avatar>
        
        <v-list-item-content>
          <v-list-item-title>Usuario invitado</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="(item, index) in items" :key="index" @click="selectRoute(item.path)">
          <v-list-item-icon>
            <v-icon color="baseColor">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title >{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="baseColor" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>ATM Intelli-Fast-Cash</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <!--  -->
      <router-view />
    </v-main>
    <footer-view />
  </v-app>
</template>

<script>
import FooterView from './views/footer-view.vue';

export default {
  name: "App",
  components: {
    FooterView
  },
  data() {
    return {
      drawer: null,
      items: [
        { title: 'Lista de transacciones', path: "/", icon: 'mdi-list-box' },
        { title: 'Acerca de', path: "/about", icon: 'mdi-information-outline' },
      ],
    };
  },
  methods: {
    selectRoute(route) {
      this.$router.push(route).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error(err);
        }
      });
    },
  },
};
</script>
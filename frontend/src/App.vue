<template>
  <ion-app>
<SideMenu></SideMenu>
  <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script setup lang="ts">
import SideMenu from "../src/views/Components/SideMenu.vue";
import { IonApp, IonRouterOutlet} from '@ionic/vue';
</script>

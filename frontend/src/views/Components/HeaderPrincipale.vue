<template>
    <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title slot="start">PhoneArena</ion-title>
        <ion-buttons slot="end">
          <ion-icon @click="navigateToCart" :icon="cartOutline" style="font-size: 28px; padding-right: 15px;"></ion-icon>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-icon @click="navigateToMessagePage" :icon="notificationsOutline" style="font-size: 28px; padding-right: 10px;"></ion-icon>
        </ion-buttons>
      </ion-toolbar>
</template>

<script setup lang="ts">

import { useRouter } from "vue-router";
import { cartOutline,notificationsOutline } from "ionicons/icons";
import { IonToolbar, IonButtons, IonMenuButton, IonTitle, IonIcon } from "@ionic/vue";

const router = useRouter();

const navigateToCart = () => {
  router.push('/PanierPage');
}

const navigateToMessagePage = () => {
  router.push('/MessagePage');
}
</script>

<style scoped>
ion-menu-button{
    color: #40bfff;
}
</style>

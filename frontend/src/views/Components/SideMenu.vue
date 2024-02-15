<template>
  <ion-menu side="start" menuId="first" contentId="main-content">
    <ion-header :translucent="true">
      <ion-toolbar class="custom-toolbar">
        <ion-title slot="start">PhoneArena</ion-title>
        <ion-buttons slot="end">
          <ion-icon :icon="phonePortrait" size="large"></ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <ion-item class="menu-card" :href="'/HomePage'" lines="none">
              <ion-icon :icon="homeOutline" class="custom-icon-color" slot="start"></ion-icon>
              Accueil
            </ion-item>
          </ion-col>
          <ion-col size="12">
            <ion-item class="menu-card" :href="'/AnnoncePage'" lines="none">
              <ion-icon :icon="receiptOutline" class="custom-icon-color" slot="start"></ion-icon>
              Annonce
            </ion-item>
          </ion-col>
          <ion-col size="12">
            <ion-item class="menu-card" :href="'/ComptePage'" lines="none">
              <ion-icon :icon="peopleOutline" class="custom-icon-color" slot="start"></ion-icon>
              Compte
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">
            <ion-item class="menu-card" :href="'/LoginPage'" lines="none">
              <ion-icon :icon="logOutOutline" class="custom-icon-color" slot="start"></ion-icon>
              Déconnexion
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-menu>
</template>


<script setup lang="ts">
import { IonTitle, IonToolbar, IonIcon, IonButtons, IonContent, IonHeader, IonMenu, IonItem, IonGrid, IonCol,IonRow} from "@ionic/vue";
import { phonePortrait, homeOutline, receiptOutline, peopleOutline , logOutOutline } from "ionicons/icons";
</script>

<style scoped>.custom-toolbar {
  --background: #40bfff;
  --color: white;
}

.custom-icon-color {
  color: #40bfff;
}

.menu-card {
  margin: 10px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.27);
  transition: box-shadow 0.3s;
}

.menu-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
</style>
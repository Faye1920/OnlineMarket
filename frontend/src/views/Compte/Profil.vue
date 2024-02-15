<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start" expand="full">
          <ion-back-button color="primary"></ion-back-button>
        </ion-buttons>
        <ion-title>Profil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item @click="navigateTo('name')">
          <ion-icon :icon="documentOutline" slot="start" color="primary"></ion-icon>
          <ion-label class="custom-label">Name</ion-label>
          <ion-label class="custom-value">Yinhong Wang</ion-label>
          <ion-icon :icon="chevronForward" slot="end" color="primary"></ion-icon>
        </ion-item>

        <ion-item @click="navigateTo('birthday')">
          <ion-icon :icon="calendarClearOutline" slot="start" color="primary"></ion-icon>
          <ion-label class="custom-label">Birthday</ion-label>
          <ion-label class="custom-value">1992-12-24</ion-label>
          <ion-icon :icon="chevronForward" slot="end" color="primary"></ion-icon>
        </ion-item>

        <ion-item @click="navigateTo('phoneNumber')">
          <ion-icon :icon="phonePortraitOutline" slot="start" color="primary"></ion-icon>
          <ion-label class="custom-label">Phone Number</ion-label>
          <ion-label class="custom-value">514-123-4567</ion-label>
          <ion-icon :icon="chevronForward" slot="end" color="primary"></ion-icon>
        </ion-item>

        <ion-item @click="navigateTo('email')">
          <ion-icon :icon="mailOutline" slot="start" color="primary"></ion-icon>
          <ion-label class="custom-label">Email</ion-label>
          <ion-label class="custom-value">faywong1920@gmail.com</ion-label>
          <ion-icon :icon="chevronForward" slot="end" color="primary"></ion-icon>
        </ion-item>

        <ion-item @click="navigateTo('changePassword')">
          <ion-icon :icon="lockClosedOutline" slot="start" color="primary"></ion-icon>
          <ion-label class="custom-label">Change Password</ion-label>
          <ion-label class="custom-value">******</ion-label>
          <ion-icon :icon="chevronForward" slot="end" color="primary"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { IonButtons, IonContent, IonHeader, IonBackButton, IonPage, IonTitle, IonToolbar, IonItem, IonIcon, IonLabel, IonList } from "@ionic/vue";
import { documentOutline, chevronForward, calendarClearOutline, phonePortraitOutline, mailOutline, lockClosedOutline } from "ionicons/icons";

const router = useRouter();

const navigateTo = (itemType) => {
  switch (itemType) {
    case "name":
      // Handle the click for the Name item
      break;
    case "birthday":
      // Handle the click for the Birthday item
      break;
    case "phoneNumber":
      // Handle the click for the Phone Number item
      break;
    case "email":
      // Handle the click for the Email item
      break;
    case "changePassword":
      // Handle the click for the Change Password item
      break;
    default:
      break;
  }
};
</script>

<style scoped>
/* Add your custom styles here if needed */
</style>

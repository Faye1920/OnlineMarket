<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start" expand="full">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Messages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item @click="something()">
          <ion-icon :icon="chatboxEllipsesOutline" slot="start" color="primary"></ion-icon>
          <ion-label class="custom-label">Chat</ion-label>
          <ion-icon :icon="chevronForward" slot="end" color="primary"></ion-icon>
        </ion-item>

        <ion-item @click="something()">
          <ion-icon :icon="notificationsOutline" slot="start" color="primary"></ion-icon>
          <ion-label class="custom-label">Notification</ion-label>
          <ion-icon :icon="chevronForward" slot="end" color="primary"></ion-icon>
        </ion-item>

        <ion-item @click="something()">
          <ion-icon :icon="receiptOutline" slot="start" color="primary"></ion-icon>
          <ion-label class="custom-label">Annonce</ion-label>
          <ion-icon :icon="chevronForward" slot="end" color="primary"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router';
import { IonButtons, IonContent, IonHeader, IonBackButton, IonPage, IonTitle, IonToolbar, IonItem, IonIcon, IonLabel, IonList } from "@ionic/vue";
import { chatboxEllipsesOutline, chevronForward, notificationsOutline, receiptOutline } from "ionicons/icons";
//const router = useRouter();

function something() {
  console.log("nani");
}
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

ion-title {
  padding: 0;
}

.custom-label {
  font-size: 14px;
  font-weight: bold;
}
</style>

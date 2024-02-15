<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start" expand="full">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Mon Profil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item class="profile-card" lines="none">
          <ion-avatar slot="start">
            <ion-img :src="'src/assets/img/images.png'" alt="Avatar"></ion-img>
          </ion-avatar>
          <ion-label>
            <div class="name">Nom d'utilisateur</div>
            <div class="email">email@example.com</div>
          </ion-label>
        </ion-item>

        <ion-item class="card-style" @click="openModalCourriel()">
          <ion-icon slot="start" :icon="mailOutline" class="custom-icon-color"></ion-icon>
          <ion-label>Mettre à jour le courriel</ion-label>
          <ion-note slot="end">{{ email }}</ion-note>
        </ion-item>

        <ion-item class="card-style" @click="openModalTelephone()">
          <ion-icon slot="start" :icon="phonePortraitOutline" class="custom-icon-color"></ion-icon>
          <ion-label>Ajouter un numéro</ion-label>
        </ion-item>

        <ion-item class="card-style" @click="openModalMotDePasse()">
          <ion-icon slot="start" :icon="lockClosedOutline" class="custom-icon-color"></ion-icon>
          <ion-label>Changer le mot de passe</ion-label>
        </ion-item>

        <ion-item class="card-style" @click="openModalAddress()">
          <ion-icon slot="start" :icon="locationOutline" class="custom-icon-color"></ion-icon>
          <ion-label>Modifier mon adresse</ion-label>
        </ion-item>

        <ion-item class="card-style">
          <ion-button expand="block" fill="solid" color="primary">
            Changer la photo
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonNote,
  modalController,
  IonAvatar,
  IonButton,
  IonToolbar,
  IonHeader,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonCol,
  IonGrid,
  IonRow,
  IonImg
} from "@ionic/vue";
import { onIonViewWillEnter } from "@ionic/vue";
import { getUserData, userId } from "../../bdd/client/system/supabase";
import ModalCourriel from "./DetailDuProfilModal/ModalCourriel.vue";
import ModalTelephone from "./DetailDuProfilModal/ModalTelephone.vue";
import ModalChangerMdp from "./DetailDuProfilModal/ModalChangerMdp.vue";
import ModalAddress from "./DetailDuProfilModal/ModalAddress.vue";

import {
  chevronForwardOutline,
  mailOutline,
  phonePortraitOutline,
  lockClosedOutline,
  locationOutline
} from "ionicons/icons";

const email = ref("");
const telephone = ref("");
const motDePasse = ref("");
const Adresse = ref("");



const openModalCourriel = async () => {
  const modal = await modalController.create({
    component: ModalCourriel,
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === 'confirm') {
    email.value = data;
  }
};

const openModalTelephone = async () => {
  const modal = await modalController.create({
    component: ModalTelephone,
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === 'confirm') {
    telephone.value = data;
  }
};

const openModalMotDePasse = async () => {
  const modal = await modalController.create({
    component: ModalChangerMdp,
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === 'confirm') {
    motDePasse.value = data;
  }
};


const openModalAddress = async () => {
  const modal = await modalController.create({
    component: ModalAddress,
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === 'confirm') {
    Adresse.value = data;
  }
};


onIonViewWillEnter(async () => {
  const userData = await getUserData();
  userId();

  if (userData) {
    
    email.value = userData.email;
  }
});
</script>

<style scoped>
.card-style, .profile-card {
  display: flex;
  align-items: center;
  margin: 10px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.27);
  background-color: white;
}

ion-avatar {
  --border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-right: 15px;
}

.avatar-img {
  border-radius: 50%;
}

ion-button {
  width: 100%;
  justify-content: center;
  margin: auto;
}

ion-icon {
  font-size: 1.5rem;
  margin-right: 10px;
}

ion-label {
  font-size: 1rem;
}

  ion-back-button {
    --color: #40bfff;
  }
</style>
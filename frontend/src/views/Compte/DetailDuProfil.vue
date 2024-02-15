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

          <ion-item class="card-style avatar-card" lines="none">
          <ion-avatar class="avatar-center">
            <ion-img :src="'src/assets/img/images.png'" alt="Avatar"></ion-img>
          </ion-avatar>
        </ion-item>

            <ion-item @click="openModalCourriel()" class="profile-card" lines="none">
            <ion-icon slot="start" :icon="mailOutline" class="custom-icon-color" size="large"></ion-icon>
              <ion-grid class="ion-no-padding">
              <ion-row>
                <ion-col size="12">
                    <ion-label>Mettre à jour le courriel</ion-label>
                  </ion-col>
                </ion-row>
              <ion-row>
               <ion-col size="12">
                  <ion-note>{{ email }}</ion-note>
                </ion-col>
              </ion-row>
            </ion-grid>
           <ion-icon slot="end" :icon="chevronForwardOutline" class="custom-icon-color" size="large"></ion-icon>
          </ion-item>
          
        <!-- Modification Numero de telephone -->
        <ion-item expand="block" @click="openModalTelephone()" class="profile-card" lines="none">
          <ion-icon slot="start" class="custom-icon-color" :icon="phonePortraitOutline" size="large"></ion-icon>
          <ion-label>Ajouter un numéro</ion-label>
          <ion-icon slot="end" :icon="chevronForwardOutline" class="custom-icon-color"  size="large"></ion-icon>
        </ion-item>
        <!-- Modification mot de passe -->
        <ion-item @click="openModalMotDePasse()" class="profile-card" lines="none">
          <ion-icon slot="start" class="custom-icon-color" :icon="lockClosedOutline" size="large"></ion-icon>
          <ion-label>Changer le mot de passe</ion-label>
          <ion-icon slot="end" :icon="chevronForwardOutline" class="custom-icon-color"  size="large"></ion-icon>
        </ion-item>
         <!-- Modifier l'addresse -->
        <ion-item @click="openModalAddress()" class="profile-card" lines="none">
          <ion-icon slot="start" class="custom-icon-color" :icon="locationOutline" size="large"></ion-icon>
          <ion-label>Modifier mon adresse</ion-label>
          <ion-icon slot="end" :icon="chevronForwardOutline" class="custom-icon-color"  size="large"></ion-icon>
        </ion-item>


 <ion-item lines="none">
    <ion-button expand="block" style="height: 50px; --background: #40bfff" class="buttonIon">Changer la photo</ion-button>
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
.profile-card {
  margin: 15px;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.27);
  background-color: white;
}


.avatar-center {
  --border-radius: 50%;
  width: 200px;
  height: 200px;
  margin: 20px;
}

.custom-icon-color {
  color: #40bfff;
}

ion-label {
  font-size: 1rem;
}

ion-button{
  width: 100%;
}
.buttonIon{
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.27);

}


  ion-back-button {
    --color: #40bfff;
  }
</style>
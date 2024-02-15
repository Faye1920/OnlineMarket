<template>
  <ion-page id="main-content">
    <HeaderPrincipale></HeaderPrincipale>
    <ion-content :fullscreen="true">
      <!-- Profile Card -->
      <ion-item class="profile-card" @click="changeAvatar">
        <ion-avatar slot="start">
          <ion-img :src="'src/assets/img/images.png'" alt="Avatar"></ion-img>
        </ion-avatar>
        <ion-label>
          <div class="name">{{ profileNom }} {{ profilPrenom }}</div>
          <div class="email">{{ profileEmail }}</div>
        </ion-label>
      </ion-item>

      <ion-list>
        <ion-item @click="goToProfil">
          <ion-icon :icon="personOutline" slot="start" class="custom-icon-color"></ion-icon>
          <ion-label>Mon Profil</ion-label>
        </ion-item>

        <ion-item @click="goToOrder">
          <ion-icon :icon="cartOutline" slot="start" class="custom-icon-color"></ion-icon>
          <ion-label>Commande</ion-label>
        </ion-item>

        <ion-item @click="goToAnnonce">
          <ion-icon :icon="notificationsOutline" slot="start" class="custom-icon-color"></ion-icon>
          <ion-label>Mes annonces</ion-label>
        </ion-item>

        <ion-item>
          <ion-icon :icon="informationCircleOutline" slot="start" class="custom-icon-color"></ion-icon>
          <ion-label>Support / FAQ</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getUserData } from "../../bdd/client/system/supabase";
import { IonContent, IonPage, IonItem, IonIcon, IonLabel, IonList, IonRow, IonCol, onIonViewWillEnter,IonImg } from "@ionic/vue";
import { cartOutline, notificationsOutline, personOutline,informationCircleOutline } from "ionicons/icons";
import HeaderPrincipale from "../Components/HeaderPrincipale.vue";

const router = useRouter();

const changeAvatar = () => {
  // Implement logic to change avatar
};

const goToProfil = () => {
  router.push("/DetailDuProfil");
};

const goToOrder = () => {
  router.push("/Commande");
};

const goToAnnonce = () => {
  router.push("/AnnoncePage");
};


const profileNom = ref("");
const profilPrenom = ref("");
const profileEmail = ref("");

onIonViewWillEnter(async () => {
  const userData = await getUserData();

  if (userData) {
    profileNom.value = userData.first_name;
    profilPrenom.value = userData.last_name;
    profileEmail.value = userData.email;
  }
});
</script>

<style scoped>
.profile-card {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin: 10px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgb(255, 255, 255);
}

.name, .email {
  margin: 0;
  line-height: 1.2;
}

.name {
  font-weight: bold;
  font-size: 1.1rem;
}

.email {
  font-size: 0.9rem;
  color: #666;
}

ion-avatar {
  --border-radius: 50%;
  width: 50px;
  height: 50px;
}

ion-img {
  border-radius: 50%;
}


.avatar-col, .text-content-col {
  display: none;
}

.custom-icon-color {
  color: #40bfff;
}
</style>
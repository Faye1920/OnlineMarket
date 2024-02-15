<template>
  <ion-page id="main-content">
    <HeaderPrincipale></HeaderPrincipale>
    <ion-content :fullscreen="true">

      <ion-item class="profile-card" lines="none">
        <ion-avatar slot="start">
          <ion-img :src="'src/assets/img/images.png'" alt="Avatar"></ion-img>
        </ion-avatar>
        <ion-label>
          <div class="name">{{ profileNom }} {{ profilPrenom }}</div>
          <div class="email">{{ profileEmail }}</div>
        </ion-label>
      </ion-item>

      <ion-list>
        <ion-item @click="goToProfil" class="card-style">
          <ion-icon :icon="personOutline" slot="start" class="custom-icon-color"></ion-icon>
          <ion-label>Mon Profil</ion-label>
        </ion-item>

        <ion-item @click="goToOrder" class="card-style">
          <ion-icon :icon="cartOutline" slot="start" class="custom-icon-color"></ion-icon>
          <ion-label>Commande</ion-label>
        </ion-item>

        <ion-item @click="goToAnnonce" class="card-style">
          <ion-icon :icon="notificationsOutline" slot="start" class="custom-icon-color"></ion-icon>
          <ion-label>Mes annonces</ion-label>
        </ion-item>

       <ion-item @click="goToFaq" class="card-style">
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
import { IonContent, IonPage, IonItem, IonIcon, IonLabel, IonList, onIonViewWillEnter,IonImg,IonAvatar } from "@ionic/vue";
import { cartOutline, notificationsOutline, personOutline,informationCircleOutline } from "ionicons/icons";
import HeaderPrincipale from "../Components/HeaderPrincipale.vue";

const router = useRouter();



const goToProfil = () => {
  router.push("/DetailDuProfil");
};

const goToOrder = () => {
  router.push("/Commande");
};

const goToAnnonce = () => {
  router.push("/AnnoncePage");
};


const goToFaq = () => {
  router.push("/Faq");
}


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
  margin: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.27);
  background-color: white;
}

.name, .email {
  line-height: 1.2;
}

.name {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 10px;
}

.email {
  font-size: 0.8rem;
  color: #666;
}

ion-avatar {
  --border-radius: 50%;
  width: 100px;
  height: 100px;
}

ion-img {
  border-radius: 50%;
}

.custom-icon-color {
  font-size: 1.9rem;
  color: #40bfff;
}


.card-style {
  display: flex;
  align-items: center;
  margin: 35px;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.27);
  background-color: rgba(245, 245, 245, 0.401);
  --ion-item-background: transparent;
}

.custom-icon-color {
  font-size: 1.2rem;
  color: #40bfff;
}


.card-style ion-icon {
  margin-right: 10px;
}

.card-style ion-label {
  font-size: 1rem;
}

</style>
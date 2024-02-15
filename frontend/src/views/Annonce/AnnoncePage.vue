<template>
  <ion-page id="main-content">
    <HeaderPrincipale></HeaderPrincipale>

    <ion-content :fullscreen="true">
      <ion-list v-if="!isLoading && !error">
        <ion-item v-for="annonce in annonces" :key="annonce.id" @click="goToAnnonceDetail(annonce.id)" lines="none">
          <ion-thumbnail slot="start">
            <ion-img :src="JSON.parse(annonce.image)[0]" alt="Annonce Image"></ion-img>
          </ion-thumbnail>
          <ion-label>
            <h2 class="item-title">{{ annonce.title }}</h2>
            <p class="item-text">{{ annonce.description }}</p>
            <p class="item-text">{{ formatDate(annonce.publication) }}</p>
          </ion-label>
            <ion-icon :icon="trashOutline" slot="end" @click.stop="handleDelete(annonce.id)" class="custom-icon-color"></ion-icon>
        </ion-item>
      </ion-list>

      <div v-if="isLoading">Loading...</div>
      <div v-if="error">{{ error }}</div>


    </ion-content>

    <ion-row class="ion-justify-content-center" style="margin-bottom: 20px">
      <ion-col size="12">
        <ion-button expand="block" style="height: 50px; --background: #40bfff" @click="goToCreerAnnonce">
          Créer une annonce
          <ion-icon :icon="duplicateOutline" slot="end" class="iconToolbar"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch} from "vue";
import { useRouter } from "vue-router";
import { trashOutline,duplicateOutline } from "ionicons/icons";
import HeaderPrincipale from "../Components/HeaderPrincipale.vue";
import { afficherAnnonceAll, sessionActuelle, supprimerAnnonce } from "@/bdd/client/system/supabase";
import {
  IonPage, IonContent, IonLabel, IonList, IonItem, IonThumbnail, IonImg, IonRow, IonCol, IonButton, IonIcon,alertController
} from "@ionic/vue";


const error = ref(null);
const router = useRouter();
const isLoading = ref(true);
const annonces = ref<Annonce[]>([]);

const presentAlert = async (annonceId: any) => {
  const alert = await alertController.create({
    header: 'Voulez-vous vraiment effacer l\'annonce?',
    cssClass: 'custom-alert',
    buttons: [
      {
        text: 'Non',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
      },
      {
        text: 'Oui',
        cssClass: 'alert-button-confirm',
        handler: () => {
          handleDeleteConfirmed(annonceId);
        }
      },
    ],
  });

  await alert.present();
};

const formatDate = (dateStr: string | number | Date) => {
  const options = { 
    year: 'numeric' as const, 
    month: '2-digit' as const, 
    day: '2-digit' as const, 
    hour: 'numeric' as const, 
    minute: '2-digit' as const, 
    hour12: true 
  };

  return new Intl.DateTimeFormat('default', options).format(new Date(dateStr));
};
  
interface Annonce {
  id: number;
  image: string;
  title: string;
  description: string;
  publication: string;
}

const goToCreerAnnonce = () => {
  router.push("/CreerAnnonce");
};

const goToAnnonceDetail = (itemId: number) => {
  router.push(`/AnnonceDetail/${itemId}`);
};

const handleDelete = (annonceId: any) => {
  presentAlert(annonceId);
};

const handleDeleteConfirmed = async (annonceId: any) => {
  const deletedAnnonceId = await supprimerAnnonce(annonceId);
  annonces.value = annonces.value.filter((annonce) => annonce.id !== deletedAnnonceId);
};


const fetchUserSession = async () => {
  const localUser = await sessionActuelle();
  if (localUser && localUser.data && localUser.data.session) {
    return localUser.data.session.user.id;
  } else {
    console.log("No active session found");
    return null;
  }
};



const fetchAnnonces = async () => {
  const userUuid = await fetchUserSession();
  if (userUuid) {
    try {
      isLoading.value = true;
      annonces.value = await afficherAnnonceAll(userUuid);
      console.log("annonce.value", annonces.value);
    } catch (e: any) {
      error.value = e.message;
      console.error("Error fetching annonces:", e.message);
    } finally {
      isLoading.value = false;
    }
  }
};


watch(router.currentRoute, async () => {
  await fetchAnnonces();
}, { deep: true });
onMounted(fetchAnnonces);

</script>

<style scoped>
ion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.249);
  background-color: white;
  height: 150px;
}

ion-thumbnail {
  --size: 100px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

ion-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.item-title {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 1rem;
  white-space: nowrap;
}

.item-text {
  font-size: 0.8rem;
  color: #666;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin:10px;
}

ion-item::part(native) {
  border-bottom: none;
}

@media (min-width: 768px) {
  ion-item {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}
.iconToolbar {
  margin-left: 10px;
}

.custom-icon-color {
  color: #40bfff;
  height: 20px;
  width: 20px;

}
</style>

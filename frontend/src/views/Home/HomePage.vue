<template>
  <ion-page id="main-content">
    <HeaderPrincipale></HeaderPrincipale>
    <ion-content :fullscreen="true">
      <ion-button class="adresse-button" fill="clear" @click="gotoGelocationPage()">
        <ion-icon :icon="locationOutline" class="filter-icon" style="font-size: 20px" slot="start"></ion-icon>
        <ion-text class="adresse-main-container">
          <ion-label class="adresse-main">Deliver to {{ nom }} - {{ ville }}</ion-label>
        </ion-text>
        <ion-icon :icon="chevronForwardOutline" class="filter-icon" style="font-size: 20px" slot="end"></ion-icon>
      </ion-button>

      <ion-searchbar v-model="searchQuery" placeholder="Qu'est-ce que vous cherchez" @ionClear="handleClear" @ionInput="handleInput"></ion-searchbar>

      <ion-button id="open-modal" expand="block" class="custom-button" fill="clear">
        <ion-icon :icon="funnelOutline" class="filter-icon" style="font-size: 20px" slot="start"></ion-icon>
        <ion-label style="text-decoration: underline">Filtrer</ion-label>
      </ion-button>

      <swiper :autoplay="{ delay: 2000 }">
        <swiper-slide v-for="sliderIMG in sliderImages" :key="sliderIMG.id">
          <ion-img :src="sliderIMG.image"></ion-img>
        </swiper-slide>
      </swiper>

      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="annonce in filteredAnnonces" :key="annonce.id" @click="goToAnnonceDetail(annonce.id)" style="padding: 0px">
            <ion-card>
              <ion-img :src="JSON.parse(annonce.image)[0]" class="phone-img"></ion-img>
              <ion-card-header>
                <ion-card-title class="limited-title">{{ annonce.title }}</ion-card-title>
                <ion-card-subtitle class="limited-subtitle">{{ annonce.modele }} </ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <p>{{ annonce.prix }}$ CAD</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Welcome</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list>
            <ion-item class="custom-ion-item">
              <ion-label position="floating">Marque</ion-label>
              <ion-select label="" placeholder="Please choose"> </ion-select>
            </ion-item>

            <ion-item class="custom-ion-item">
              <ion-label position="floating">Modèle</ion-label>
              <ion-select label="" placeholder="Please choose"> </ion-select>
            </ion-item>
            <ion-item class="custom-ion-item">
              <ion-label position="floating">Couleur</ion-label>
              <ion-select label="" placeholder="Please choose">
                <!-- Add ion-select-option elements here -->
              </ion-select>
            </ion-item>
            <ion-item class="custom-ion-item">
              <ion-label position="floating">Quantité de ram</ion-label>
              <ion-select label="" placeholder="Please choose"> </ion-select>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Price Range</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-input type="number" placeholder="Min" v-model="minValue"></ion-input>
              <ion-input type="number" placeholder="Max" v-model="maxValue"></ion-input>
            </ion-item>
            <ion-item lines="none">
              <div class="range-container">
                <div class="range-labels">
                  <ion-label class="range-label">MIN</ion-label>
                </div>
                <ion-range class="custom-range" :dual-knobs="true" :min="0" :max="2500" :step="50" :value="{ lower: minValue, upper: maxValue }" @ionChange="updateValues($event)"> </ion-range>
                <div class="range-labels">
                  <ion-label class="range-label">MAX</ion-label>
                </div>
              </div>
            </ion-item>
          </ion-list>
          <ion-row class="ion-justify-content-center" style="margin-bottom: 20px">
            <ion-col size="12" class="button-col">
              <ion-button @click="confirm()" expand="block" style="height: 50px; --background: #40bfff">Sauvegarder</ion-button>
            </ion-col>
          </ion-row>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import "swiper/css";
import { ref } from "vue";
import "swiper/css/pagination";
import router from "../../router";
import "@ionic/vue/css/ionic-swiper.css";
import { Swiper, SwiperSlide } from "swiper/vue";
import HeaderPrincipale from "../Components/HeaderPrincipale.vue";
import { chevronForwardOutline, funnelOutline, locationOutline } from "ionicons/icons";
import { getAnnoncesByUserPreferences, getUserData, getUserId, getUserPreference } from "@/bdd/client/system/supabase";
import { IonContent, IonPage, IonSearchbar, IonGrid, IonCol, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonButton, IonIcon, IonLabel, IonText, onIonViewWillEnter, IonCardSubtitle, IonModal, IonItem, IonInput, IonHeader, IonToolbar, IonTitle, IonButtons, IonRange, IonSelect, IonList } from "@ionic/vue";
import { OverlayEventDetail } from "@ionic/core/components";
import { RangeChangeEventDetail } from "@ionic/vue";

const modal = ref();
const input = ref();
const nom = ref("");
const ville = ref("");
const searchQuery = ref("");
const annoncesOriginales = ref<Annonce[]>([]);
const filteredAnnonces = ref<Annonce[]>([]);
const message = ref("modal.");
const minValue = ref(0);
const maxValue = ref(2500);

interface SliderImage {
  id: number;
  image: string;
}
interface Annonce {
  id: number;
  title: string;
  modele: string;
  prix: string;
  image: string;
}

const cancel = () => modal.value.$el.dismiss(null, "cancel");

const confirm = () => {
  modal.value.$el.dismiss(null, "confirm");
};

const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
  if (ev.detail.role === "confirm") {
    message.value = `Hello, ${ev.detail.data}!`;
  }
};

const gotoGelocationPage = () => {
  router.push("/GeolocalisationPage");
};

const goToFilter = () => {
  router.push("/FilterPage");
};

const goToAnnonceDetail = (itemId: number) => {
  router.push(`/AnnonceDetail/${itemId}`);
};

function updateValues(event: CustomEvent<RangeChangeEventDetail>) {
  const rangeValue = event.detail.value as { lower: number; upper: number };
  minValue.value = rangeValue.lower;
  maxValue.value = rangeValue.upper;
}

const sliderImages = ref<SliderImage[]>([
  {
    id: 1,
    image: "https://m-cdn.phonearena.com/images/article/153037-wide-two_1200/PhoneArena-2023-Awards-These-are-the-best-phones-of-the-year.jpg",
  },
  {
    id: 2,
    image: "https://pbs.twimg.com/media/EHax7YYUwAQS3e2?format=jpg&name=4096x4096",
  },
  {
    id: 3,
    image: "https://www.ccsinsight.com/wp-content/uploads/2022/06/Second-hand_phones900.png",
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/jerrick/image/upload/60278ce6e5abae001c525d99.png",
  },
  {
    id: 5,
    image: "https://m-cdn.phonearena.com/images/article/139572-wide-two_1200/Welcome-to-a-brand-new-PhoneArena.jpg",
  },
]);

const handleInput = (event: any) => {
  const query = event.target.value.toLowerCase();
  filteredAnnonces.value = filterAnnonces(query);
};

const handleClear = () => {
  searchQuery.value = "";
  filteredAnnonces.value = [...annoncesOriginales.value];
};

const filterAnnonces = (query: any) => {
  return annoncesOriginales.value.filter((annonce) => annonce.title.toLowerCase().includes(query) || annonce.modele.toLowerCase().includes(query));
};

const fetchUserDetails = async () => {
  try {
    const userId = await getUserId();
    const name = await getUserData();
    const region = await getUserPreference(userId);
    nom.value = name?.first_name;
    ville.value = region?.region;
  } catch (error: any) {
    console.error("Error fetching user details:", error.message);
  }
};

const fetchUserAnnonces = async (userId: string) => {
  try {
    const userAnnonces = await getAnnoncesByUserPreferences(userId);
    if (userAnnonces && userAnnonces.length > 0) {
      annoncesOriginales.value = userAnnonces;
      filteredAnnonces.value = userAnnonces;
    } else {
      annoncesOriginales.value = [];
      filteredAnnonces.value = [];
    }
  } catch (error: any) {
    console.error("Error fetching annonces:", error.message);
  }
};

onIonViewWillEnter(async () => {
  console.log("Home page will enter");

  try {
    const userId = await getUserId();
    if (userId) {
      await fetchUserDetails();
      await fetchUserAnnonces(userId);
    } else {
      console.log("No active session found");
    }
  } catch (error: any) {
    console.error("An error occurred:", error.message);
  }
});
</script>

<style scoped>
ion-content {
  background-color: rgb(255, 255, 255);
}
.adresse-button {
  margin: 0px;
  font-size: 14px;
  color: black;
  background-color: #c8edff;
  width: 100%;
  height: 50px;
}

.custom-button {
  padding-left: 10px;
  font-size: 12px;
  color: gray;
}
ion-img {
  padding: 8px;
  height: 200px;
  margin-bottom: 10px;
}

ion-searchbar {
  padding: 20px 15px;
  color: gray;
  border-radius: 10px;
}

ion-card {
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid rgb(199, 186, 186);
}

.phone-img {
  padding: 0px;
  height: 130px;
}

ion-card-header {
  padding: 10px 0px;
}

ion-card-title {
  font-size: 14px;
  font-weight: bold;
  color: black;
}

.limited-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  max-height: 20px;
  height: 20px;
}

ion-card-subtitle {
  padding: 0px;
  margin: 0px;
  font-size: 14px;
  color: rgb(160, 160, 160);
}

.limited-subtitle {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 50px;
  height: 20px;
}

ion-card-content {
  padding: 5px 0px;
  font-size: 14px;
  color: #40bfff;
  font-weight: bold;
}

ion-input {
  --padding-start: 0;
  --padding-end: 0;
  margin: 0 10px;
  width: calc(50% - 20px); /* Adjust width as necessary */
  border: 1px solid var(--ion-color-medium);
  border-radius: 4px;
}

ion-item {
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.range-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* Ensure the container takes up full width */
}

ion-range {
  flex-grow: 1; /* Allows the range to expand and take available space */
  --padding-start: 0; /* Remove padding if necessary */
  --padding-end: 0; /* Remove padding if necessary */
}

ion-label[slot="start"],
ion-label[slot="end"] {
  width: auto; /* Adjust width as necessary */
  min-width: 40px; /* Ensure labels have enough space */
}
</style>

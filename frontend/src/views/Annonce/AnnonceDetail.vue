<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start" expand="full">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Detail de l'annonce</ion-title>
        <ion-icon :icon="phonePortraitOutline" slot="end" class="iconToolbar"></ion-icon>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" :scroll-y="true">


      <ion-list v-if="item">
        <ion-item style="padding: 0px">
          <swiper :pagination="{ clickable: true }">
            <div class="swiper-navigation"></div>
            <template v-for="slide in slides" :key="slide.id">
              <swiper-slide>
                <ion-img :src="slide.content" alt="Item Image"></ion-img>
              </swiper-slide>
            </template>
          </swiper>
        </ion-item>

        <ion-item>
          <ion-label class="item-title">{{ item.title }}</ion-label>
          <ion-button v-if="item.FK_uuid !== userUuid" @click="addToCart()">Ajouter au Panier</ion-button>
        </ion-item>

        <ion-item>
          <ion-col class="colCustom">
            <ion-label class="item-code">Publication: {{ formatDateTime(item.publication) }}</ion-label>
          </ion-col>
        </ion-item>

        <ion-item>
          <ion-label class="item-prix">${{ item.prix }}</ion-label>
        </ion-item>

        <ion-item @click="toggleDisplay">
          <ion-label class="custom-label">Display</ion-label>
          <ion-icon :icon="showDisplay ? chevronUp : chevronDown"></ion-icon>
        </ion-item>

        <ion-item v-show="showDisplay" style="height: auto">
          <ion-label class="custom-info">
            Marque: {{ item.marque }}
            <br />
            Modèle: {{ item.modele }}
            <br />
            États: {{ item.etat }}
            <br />
            Mémoire: {{ item.memoire }}
            <br />
            Ram: {{ item.ram }}
          </ion-label>
        </ion-item>

        <ion-item @click="toggleDescription" >
          <ion-label class="custom-label">Description</ion-label>
          <ion-icon :icon="showDescription ? chevronUp : chevronDown"></ion-icon>
        </ion-item>

        <ion-item v-show="showDescription" style="height: auto">
          <ion-label>
            <div class="description-content">{{ item.description }}</div>
          </ion-label>
        </ion-item>
      </ion-list>

    <ion-item class="chart-container">
        <ion-label class="custom-label" >Statistiques</ion-label>
        <ion-icon :icon="alertCircleOutline" slot="end" @click="legende()"></ion-icon>
        <SpiderChart :chartData="ChartData" :width="chartWidth" :height="chartHeight" />
      </ion-item>

<ion-toast :is-open="showToast" :message="toastMessage" duration="2000" @ionToastDidDismiss="() => showToast = false"></ion-toast>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { IonIcon } from "@ionic/vue";
import SpiderChart from "../Components/SpiderChart.vue";
import { chevronUp, chevronDown ,alertCircleOutline, phonePortraitOutline} from "ionicons/icons";
import { fetchAnnonceById, fetchDetailsSpiderChart, sessionActuelle } from "@/bdd/client/system/supabase";
import { IonPage, IonContent, IonLabel, IonList, IonItem, IonImg, IonCol, IonButton, IonBackButton, IonToolbar, IonHeader, IonButtons, IonTitle,IonToast } from "@ionic/vue";
import { Preferences } from "@capacitor/preferences";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

const route = useRoute();
const showToast = ref(false);
const toastMessage = ref(""); 
const showDisplay = ref(false);
const slides = ref<Slide[]>([]);
const cartItems = ref<any[]>([]);
const showDescription = ref(false);
const item = ref<Item | null>(null);
const isChartDataLoaded = ref(false);
const itemId = ref<number | null>(null);
const userUuid = ref<string | null>(null);

const chartWidth = computed(() => window.innerWidth * 0.7);
const chartHeight = computed(() => window.innerHeight * 0.7);

interface Slide {
  id: number;
  content: string;
}

interface Item {
  id: number;
  FK_uuid: string;
  title: string;
  publication: Date;
  prix: number;
  marque: string;
  modele: string;
  etat: string;
  memoire: string;
  ram: string;
  description: string;
  image: string;
}

const windowSize = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
});

window.addEventListener("resize", () => {
  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;
});


interface ChartData {
  TauxRafraichissement: any;
  Batterie: any;
  Résolution: any;
  Taille: any;
  RAM: any;
}

const ChartData = ref<ChartData>({
  TauxRafraichissement: 0,
  Batterie: 0,
  Résolution: 0,
  Taille: 0,
  RAM: 0,
});

const toggleDescription = () => {
  showDescription.value = !showDescription.value;
};

const toggleDisplay = () => {
  showDisplay.value = !showDisplay.value;
};

const legende = () => {

}

const formatDateTime = (timestamp: string | number | Date): string => {
  let date: Date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }
  if (isNaN(date.getTime())) {
    console.error("Invalid date provided:", timestamp);
    return "Invalid date";
  }
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric", 
    month: "numeric", 
    day: "numeric", 
    hour: "numeric", 
    minute: "numeric"
  };
  return date.toLocaleString("en-US", options);
}


const addToCart = async () => {
  if (item.value) {
    const isItemInCart = cartItems.value.some(cartItem => cartItem.id === item.value!.id);

    if (!isItemInCart) {
      const newItem = {
        id: item.value.id,
        name: item.value.title,
        amount: item.value.prix,
        quantity: 1,
        image: slides.value[0]?.content,
      };

      cartItems.value.push(newItem);
      await Preferences.set({
        key: "cartItems",
        value: JSON.stringify(cartItems.value),
      });

      toastMessage.value = "Article ajouté au panier!";
      showToast.value = true;
    } else {
      toastMessage.value = "Cet article est déjà dans votre panier!";
      showToast.value = true;
    }
  } else {
    console.error("Cannot add to cart, item is null");
  }
};

const loadUserAndCartData = async () => {
  const localUser = await sessionActuelle();
  userUuid.value = localUser?.data?.session?.user?.id || null;

  const storedCartItems = await Preferences.get({ key: "cartItems" });
  cartItems.value = storedCartItems.value ? JSON.parse(storedCartItems.value) : [];
};

const loadItemAndImages = async (id: number) => {
  const fetchedItem = await fetchAnnonceById(id);
  if (fetchedItem) {
    item.value = fetchedItem;

    if (item.value) {
      const images = JSON.parse(item.value.image || '[]');
      slides.value = images.map((imageUrl: string, index: number) => ({ id: index, content: imageUrl }));
    }
  }
};


watch(
  item,
  async (newItem) => {
    if (newItem && newItem.modele && newItem.ram) {
      const metrics = await fetchDetailsSpiderChart(newItem.modele, newItem.ram);
      ChartData.value = {
        TauxRafraichissement: metrics.refreshRateMetric,
        Batterie: metrics.batteryCapacityMetric,
        Résolution: metrics.displayResolutionMetric,
        Taille: metrics.displaySizeMetric,
        RAM: metrics.ramMetric,
      };
      isChartDataLoaded.value = true;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  itemId.value = route.params.id ? Number(route.params.id) : null;
  if (itemId.value) {
    await loadItemAndImages(itemId.value);
    await loadUserAndCartData();
  }
});
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
  font-size: 1.25rem;
  line-height: 1.625rem;
}

#container p {
  font-size: 1rem;
  line-height: 1.375rem;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

ion-list {
  padding: 0;
}

ion-title {
  padding: 0;
}

.colCustom{
  padding: 0;
}

.item-title {
  font-size: 1.125rem;
  font-weight: bold;
  line-height: 1.25rem;
}

.item-code {
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: gray;
}

.item-prix {
  font-size: 1.625rem;
  font-weight: bold;
  color: #40bfff;
}

.custom-label {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1.25rem;
}

.custom-info {
  font-size: 1rem;
  line-height: 1.875rem;
}

.description-content {
  white-space: normal;
  overflow: hidden;
  font-size: 1rem;
  line-height: 1.5rem;
}

ion-img {
  width: 70vw;
  height: 70vw;
  max-width: 1000px;
  max-height: 1000x;
}

@media (max-width: 768px) {
  .item-title {
    font-size: 1rem;
  }
  .item-prix {
    font-size: 1.5rem;
  }
  .custom-label, .custom-info, .description-content {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .item-title {
    font-size: 0.875rem;
  }
  .item-prix {
    font-size: 1.375rem;
  }
}

.iconToolbar{
  margin: 5px;
  height: 25px;
  width: 25px;
  color: #000;
}

  ion-back-button {
    --color: #40bfff;
  }

  ion-button {
    --background: #40bfff;
    --background-activated: darken(#40bfff, 10%);
    --background-hover: lighten(#40bfff, 10%);
    color: white;
    height: 36px;
  }
</style>
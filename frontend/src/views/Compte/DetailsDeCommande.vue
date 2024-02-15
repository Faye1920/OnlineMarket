<template>
  <ion-page id="main-content">
   <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button color="primary"></ion-back-button>
        </ion-buttons>
        <ion-title>Détail des commandes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content
      :fullscreen="true"
      class="ion-padding"
      style="--background: rgb(255, 255, 255)"
    >
      <ion-title class="ion-margin">Produits</ion-title>

      <ion-list>
        <ion-item v-for="item in filteredItems" :key="item.id">
          <ion-thumbnail slot="start">
            <ion-img :src="item.image" alt="Item Image"></ion-img>
          </ion-thumbnail>
          <ion-label>
            <h2 class="item-title">{{ item.title }}</h2>
            <p class="item-text">{{ item.prix }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-title class="ion-margin">Payments Details</ion-title>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  IonContent,
  IonPage,
  IonItem,
  IonThumbnail,
  IonImg,
  IonLabel,
  IonList,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton
} from "@ionic/vue";

const router = useRouter();
const routeId = ref(null);

const items = [
  {
    id: 1,
    image: "src/assets/img/image Product.png",
    numero_de_commande: "LQNSU346JK",
    order_statuts: "Shipping",
    items: "2",
    prix: "299,43",
    title: "Honor 9X Specs",
    text: "La caméra frontale est dotée d'un capteur pop-up motorisé de 16 MP. Les capteurs du téléphone...",
    time: new Date("2024-01-08T12:38:00"),
  },
  {
    id: 2,
    image: "src/assets/img/image Product.png",
    numero_de_commande: "LQNSU346JK",
    order_statuts: "Shipping",
    items: "2",
    prix: "299,43",
    title: "Honor 9X Specs",
    text: "La caméra frontale est dotée d'un capteur pop-up motorisé de 16 MP. Les capteurs du téléphone...",
    time: new Date("2024-01-08T12:38:00"),
  },
];

const filteredItems = ref([]);

const filterItemsById = () => {
  const id = parseInt(routeId.value);
  filteredItems.value = items.filter((item) => item.id === id);
};

onMounted(() => {
  routeId.value = router.currentRoute.value.params.id;
  filterItemsById();
});
</script>

<style scoped>
ion-content {
  background-color: #fff;
}

  ion-back-button {
    --color: #40bfff;
  }
</style>

<template>
  <ion-page id="main-content">
   
   <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Détail des commandes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content
      :fullscreen="true"
      class="ion-padding"
      style="--background: rgb(255, 255, 255)"
    >
      <ion-title class="ion-margin">Products</ion-title>

      <ion-list>
        <ion-item
          v-for="item in items"
          :key="item.id"
          @click="goToCommandeDetail(item.id)"
        >
          <ion-card style="background-color: #fff; padding: 20px">
            <ion-card-title>{{ item.numero_de_commande }}</ion-card-title>
            <ion-card-subtitle
              >Order at phoneArea : December 1, 2023</ion-card-subtitle
            >
            <hr
              style="height: none; border: none; border-top: 1px dashed #ddd"
            />

            <div class="cardCustom">
              <ion-card-subtitle>Order Status:</ion-card-subtitle>
              <ion-card-subtitle>{{ item.title }}</ion-card-subtitle>
            </div>

            <div class="cardCustom">
              <ion-card-subtitle>Items:</ion-card-subtitle>
              <ion-card-subtitle
                >{{ item.items }} items purchased</ion-card-subtitle
              >
            </div>

            <div class="cardCustom">
              <ion-card-subtitle>Price:</ion-card-subtitle>
              <ion-card-subtitle class="priceCustom"
                >${{ item.prix }}</ion-card-subtitle
              >
            </div>
          </ion-card>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonContent,
  IonPage,
  IonItem,
  IonList,
  IonCard,
  IonTitle,
  IonCardSubtitle,
  IonCardTitle,
  IonToolbar,
  IonHeader,
  IonButtons,
  IonBackButton
} from "@ionic/vue";

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

const router = useRouter();

const goToCommandeDetail = (itemId: number) => {
  router.push(`/DetailsDeCommande/${itemId}`);
};
</script>

<style scoped>
ion-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

ion-title,
ion-card-subtitle {
  color: #000;
}

ion-card-title {
  color: #000;
}

.priceCustom {
  color: #40bfff;
}

.cardCustom {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
  ion-back-button {
    --color: #40bfff;
  }
</style>

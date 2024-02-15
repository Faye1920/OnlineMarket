<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Panier</ion-title>
        <ion-icon :icon="cartOutline" slot="end" class="iconToolbar"></ion-icon>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-list>
          <ion-list-header>
            <ion-title id="titlePanier" size="large"> Panier </ion-title>
          </ion-list-header>
          <ion-item v-for="(item, index) in cartItems" :key="index">
            <ion-thumbnail slot="start">
              <ion-img :src="item.image"></ion-img>
            </ion-thumbnail>
            <ion-label>
              <h2>{{ item.name }}</h2>
            </ion-label>
            <ion-label class="ion-text-end">${{ item.amount }}</ion-label>
            <ion-item>
              <ion-icon
                :icon="trashOutline"
                slot="end"
                color="primary"
                size="small"
                @click="removeItem(index)"
              ></ion-icon>
            </ion-item>
          </ion-item>
        </ion-list>
        <ion-list>
          <ion-list-header> Récapitulatif de la commande </ion-list-header>
          <ion-item>
            <ion-label>Total :</ion-label>
            <ion-label class="ion-text-end">${{ calculateTotal() }}</ion-label>
          </ion-item>
        </ion-list>
        <ion-item>
          <ion-button id="open-modal" expand="block" @click="onCheckoutClicked">
            Passer à la caisse
          </ion-button>
        </ion-item>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { trashOutline,cartOutline } from "ionicons/icons";
import { loadStripe } from "@stripe/stripe-js";
import { PUBLISHABLE_KEY } from "../../bdd/data/constants";
import { sessionActuelle, userId } from "../../bdd/client/system/supabase";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonList,
  IonListHeader,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonImg,
  IonButtons,
  IonBackButton,
  IonIcon,
  onIonViewWillEnter,
} from "@ionic/vue";
import { Preferences } from "@capacitor/preferences";

const stripePromise = loadStripe(PUBLISHABLE_KEY);


function calculateTotal() {
  return cartItems.value.reduce(
    (acc, item) => acc + item.amount * item.quantity,
    0
  );
}

function calculateShipping() {
  return cartItems.value.reduce((acc, item) => acc + item.shippingCost, 0);
}

async function onCheckoutClicked() {
  const stripe = await stripePromise;
  fetch("http://localhost:8080/payment", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      products: cartItems.value.map((item) => ({
        name: item.name,
        image: item.image,
        amount: item.amount,
        quantity: item.quantity,
      })),
      routes: {
        success_url: "http://localhost:8100/success",
        cancel_url: "http://localhost:8100/cancel",
      },
    }),
  })
    .then((response) => response.json())
    //to check the stripe?
    .then((session) => stripe?.redirectToCheckout({ sessionId: session.id }))
    .catch((error) => console.error("Error:", error));
}

const cartItems = ref([]);

onIonViewWillEnter(async () => {
  sessionActuelle();
  userId();
  const storedCartItems = await Preferences.get({ key: "cartItems" });
  if (storedCartItems.value) {
    cartItems.value = JSON.parse(storedCartItems.value);
    console.log(cartItems.value);
  }
});

async function removeItem(index: number) {
  cartItems.value.splice(index, 1);
  await Preferences.set({
    key: "cartItems",
    value: JSON.stringify(cartItems.value),
  });
}
</script>

<style scoped>
#titlePanier {
  padding-left: 0;
}

ion-button {
  width: 100%;
  justify-content: center;
  --background: #40bfff;
  height: 50px;
  border-radius: 10px;
}

ion-back-button{
  color: #40bfff;
}

.iconToolbar{
  margin: 5px;
  height: 25px;
  width: 25px;
  color: #000;
}

</style>
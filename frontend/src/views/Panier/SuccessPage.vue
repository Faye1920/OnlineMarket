<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Stripe Payment Gateway</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="small">Stripe Payment Gateway</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-label class="cancel-label">Votre transaction a été complétée !</ion-label>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-button expand="block" class="cancel-go-to-checkout-page-button" fill="clear" @click="onGoToCheckoutPageClicked">Retour à l'accueil</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonButton, IonCol, IonLabel } from "@ionic/vue";
import { Preferences } from "@capacitor/preferences";

const router = useRouter();
const cartItems = ref([]);

async function onGoToCheckoutPageClicked() {
  cartItems.value = [];
  await Preferences.set({ key: "cartItems", value: JSON.stringify(cartItems.value) });
  router.push("/HomePage");
}
</script>

<style scoped>
.cancel-label {
  margin-top: 150px;
  display: flex;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.cancel-go-to-checkout-page-button,
ion-button {
  margin-top: 20px;
  color: white;
  --background: #40bfff;
  height: 50px;
  border-radius: 10px;
}
</style>
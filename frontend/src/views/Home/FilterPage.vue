<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" expand="full">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Filter Search</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item class="custom-ion-item">
          <ion-label position="floating">Marque</ion-label>
          <ion-select placeholder="Please choose">
            <!-- Add ion-select-option elements here -->
          </ion-select>
        </ion-item>
        <ion-item class="custom-ion-item">
          <ion-label position="floating">Endroit</ion-label>
          <ion-select placeholder="Please choose">
            <!-- The select is disabled because clicking the item will open the modal -->
          </ion-select>
        </ion-item>
        <ion-item class="custom-ion-item">
          <ion-label position="floating">Modèle</ion-label>
          <ion-select placeholder="Please choose">
            <!-- Add ion-select-option elements here -->
          </ion-select>
        </ion-item>
        <ion-item class="custom-ion-item">
          <ion-label position="floating">Couleur</ion-label>
          <ion-select placeholder="Please choose">
            <!-- Add ion-select-option elements here -->
          </ion-select>
        </ion-item>
        <ion-item class="custom-ion-item">
          <ion-label position="floating">Quantité de ram</ion-label>
          <ion-select placeholder="Please choose">
            <!-- Add ion-select-option elements here -->
          </ion-select>
          <!-- We can add more later on -->
        </ion-item>
        <ion-item lines="none">
          <ion-label>Price Range</ion-label>
        </ion-item>
        <ion-item lines="none">
          <ion-input type="number" placeholder="Min" v-model="minValue"></ion-input>
          <ion-input type="number" placeholder="Max" v-model="maxValue"></ion-input>
        </ion-item>
        <ion-item lines="none">
          <ion-range :dual-knobs="true" :min="0" :max="2500" :step="50" :value="{ lower: minValue, upper: maxValue }" @ionChange="updateValues($event)">
            <ion-label slot="start">MIN</ion-label>
            <ion-label slot="end">MAX</ion-label>
          </ion-range>
        </ion-item>
      </ion-list>
      <ion-row class="ion-justify-content-center" style="margin-bottom: 20px">
        <ion-col size="12" class="button-col">
          <ion-button @click="goToHomePage" expand="block" style="height: 50px; --background: #40bfff">Sauvegarder</ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonPage, IonList, IonItem, IonLabel, IonSelect, IonRange, IonButton, IonInput } from "@ionic/vue";

import { onMounted, ref } from "vue";
import { RangeChangeEventDetail } from "@ionic/vue"; // Import RangeChangeEventDetail
import router from "@/router";

// State for the minimum and maximum values
const minValue = ref(0);
const maxValue = ref(2500);

// Method to update the min and max values based on the range slider's change event
function updateValues(event: CustomEvent<RangeChangeEventDetail>) {
  const rangeValue = event.detail.value as { lower: number; upper: number };
  minValue.value = rangeValue.lower;
  maxValue.value = rangeValue.upper;
}

const goToHomePage = () => {
  router.push("/HomePage");
};

// onMounted{
//   const brand = fetchBrands
// }

</script>

<style scoped>
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

ion-range {
  width: 100%;
}
</style>

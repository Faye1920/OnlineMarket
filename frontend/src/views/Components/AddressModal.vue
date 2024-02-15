<template>
  <ion-modal :is-open="isOpen" @ionModalDidDismiss="emitClose">
    <ion-header>
      <ion-toolbar>
        <ion-title>Entrez votre adresse</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emitClose">Fermer</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">Numéro civique</ion-label>
        <ion-input v-model="numeroCivique" type="number"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">La rue</ion-label>
        <ion-input v-model="rue" type="text"></ion-input>
      </ion-item>
        <ion-item>
        <ion-label position="floating">Ville</ion-label>
        <ion-input v-model="ville" type="text"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Code Postal</ion-label>
        <ion-input v-model="codePostal" type="text"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Province</ion-label>
        <ion-input v-model="province" type="text"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Pays</ion-label>
        <ion-input v-model="pays" type="text"></ion-input>
      </ion-item>
      <ion-row class="ion-justify-content-center" style="margin-bottom: 20px">
          <ion-col size="12" class="button-col">
            <ion-button
              @click="submitAddress"
              expand="block"
              style="height: 50px; --background: #40bfff"
              >Sauvegarder</ion-button
            >
          </ion-col>
        </ion-row>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonCol,
  IonRow
} from "@ionic/vue";

// Define props to receive the address data
const props = defineProps({
  isOpen: Boolean,
  currentAddress: Object
});

const emits = defineEmits(["close", "submitAddress"]);


const numeroCivique = ref(props.currentAddress?.numeroCivique || '');
const rue = ref(props.currentAddress?.rue || '');
const ville = ref(props.currentAddress?.ville || '');
const codePostal = ref(props.currentAddress?.codePostal || '');
const province = ref(props.currentAddress?.ville || '');
const pays = ref(props.currentAddress?.pays || '');


const emitClose = () => {
  emits("close");
};

const submitAddress = () => {
  const addressData = {
    numeroCivique: numeroCivique.value,
    rue: rue.value,
    ville: ville.value,
    codePostal: codePostal.value,
    province: province.value,
    pays: pays.value,
  };
  emits("submitAddress", addressData);
  emitClose();
};
</script>

<style scoped>
.button-col {
  padding-top: 40px;
}
</style>

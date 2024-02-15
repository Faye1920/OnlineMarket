<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Annuler</ion-button>
        </ion-buttons>
          <ion-title>Modification</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-list>
        <ion-item lines="none">
           <h1>Ajouter un numéro</h1>
          <ion-row>
            <ion-col size="auto">
              <ion-select placeholder="+1" interface="popover">
                <ion-select-option value="+1">+1</ion-select-option>
                <ion-select-option value="+7">+7</ion-select-option>
                <ion-select-option value="+86">+86</ion-select-option>
                <ion-select-option value="+33">+33</ion-select-option>
              </ion-select>
            </ion-col>
            <ion-col>
              <ion-input type="tel" placeholder="Phone number" class="phoneNumber"></ion-input>
            </ion-col>
          </ion-row>
        </ion-item>
        <p>
          PhoneArena utilisera votre numéro de cellulaire pour des raisons de sécurité et de personnalisation des annonces.
        </p>
      </ion-list>
        </ion-grid>
        <ion-button expand="full" shape="round" @click="confirm" :strong="true" style="height: 50px; --background: #40bfff">Confirmer</ion-button>
      </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonInput,
  modalController,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  IonList,
  IonSelect,
  IonSelectOption
} from "@ionic/vue";
import { ref } from "vue";

const name = ref();
const inputRef = ref();

const phoneOptions = {
    mask: ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    elementPredicate: (el: HTMLIonInputElement) => {
      return new Promise((resolve) => {
        requestAnimationFrame(async () => {
          const input = await el.getInputElement();
          resolve(input);
        });
      });
    },
  };

const cancel = () => modalController.dismiss(null, "cancel");

const confirm = () => {
  if (phoneOptions) {
    modalController.dismiss(name.value, "confirm");
  } else {
    // Gérer le cas où l'e-mail n'est pas valide, par exemple, afficher un message d'erreur
    console.error("L'e-mail n'est pas valide");
  }
};


function validate(ev: any) {
  const value = ev.target.value;

  console.log(value);

  inputRef.value.$el.classList.remove("ion-valid");
  inputRef.value.$el.classList.remove("ion-invalid");

  if (value === "") return;

  const isValidPhone = value.length === phoneOptions.mask.length;
  isValidPhone ? inputRef.value.$el.classList.add("ion-valid") : inputRef.value.$el.classList.add("ion-invalid");
}

function markTouched() {
  inputRef.value.$el.classList.add("ion-touched");
}
</script>

<style scoped>
.phoneNumber {
  --padding-start: 5px; /* Adjust padding to your preference */
  --border-color: #000; /* Border color */
  --border-width: 1px; /* Border width */
  --border-style: solid; /* Border style */
  --border-radius: 4px; /* Border radius for rounded corners */
}

/* Style for ion-select for consistency */
ion-select {
  --padding-start: 5px;
  --border-color: #000;
  --border-width: 1px;
  --border-style: solid;
  --border-radius: 4px;
}

  ion-back-button {
    --color: #40bfff;
  }
</style>

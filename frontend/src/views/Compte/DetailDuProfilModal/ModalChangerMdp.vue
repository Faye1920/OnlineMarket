<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Annuler</ion-button>
        </ion-buttons>
        <ion-title>mot de passe</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
         <ion-grid>
           <ion-row>
             <ion-avatar>
                  <img :src="'src/assets/img/ProfilePicture.png'" alt="Avatar" class="avatar-img" />
              </ion-avatar>
             <ion-label>{{ courriel }}</ion-label>
           </ion-row>
         </ion-grid>
        <ion-list>

          <ion-item>
            <ion-input
              ref="inputRef"
              aria-label="Email"
              :clear-input="true"
              label-placement="floating"
              type='email'
              label="Entrez votre mot de passe du COMPTE"
              error-text="Invalid email"
              v-model="name"></ion-input>
          </ion-item>

              <ion-item>
            <ion-input
              ref="inputRef"
              aria-label="Email"
              :clear-input="true"
              label-placement="floating"
              type='email'
              label="Entrez votre nouveau mot de passe"
              error-text="Invalid email"
              v-model="name"
              ></ion-input>
          </ion-item>
    
    
             <ion-item>
               <ion-input
                ref="inputRef"
                v-model="passwordLogin"
                label="Confirmer nouveau mot de passe"
                label-placement="floating"
                error-text="Invalid password"
                type="password"
                id="motDePasse">
              </ion-input>
             </ion-item>
        </ion-list>
        <ion-button expand="full" shape="round" @click="confirm" :strong="true" style="height: 50px; --background: #40bfff">Confirmer</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { getUserData } from '@/bdd/client/system/supabase';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  modalController,
  IonPage,
  IonGrid,
  IonAvatar,
  IonRow
} from '@ionic/vue';
import { onMounted, ref } from 'vue';

const password = ref('');
const confirmPassword = ref('');
const inputRef = ref();
const inputRefConfirm = ref();
const courriel = ref('');


const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => modalController.dismiss(password.value, 'confirm');

function validate() {
  inputRef.value.$el.classList.remove('ion-valid');
  inputRef.value.$el.classList.remove('ion-invalid');

  if (password.value === '') return;

  const isValidPassword = password.value.length >= 8;

  isValidPassword ? inputRef.value.$el.classList.add('ion-valid') : inputRef.value.$el.classList.add('ion-invalid');
}

function validateConfirm() {
  inputRefConfirm.value.$el.classList.remove('ion-valid');
  inputRefConfirm.value.$el.classList.remove('ion-invalid');

  if (confirmPassword.value === '') return;

  const passwordsMatch = confirmPassword.value === password.value;

  passwordsMatch
    ? inputRefConfirm.value.$el.classList.add('ion-valid')
    : inputRefConfirm.value.$el.classList.add('ion-invalid');
}

function markTouched() {
  inputRef.value.$el.classList.add('ion-touched');
  inputRefConfirm.value.$el.classList.add('ion-touched');
}


onMounted(async () => {
  const userData = await getUserData();

  if (userData) {
    
    courriel.value = userData.email;
  }
});
</script>

<style scoped>
ion-input {
  --border-color: #000;
  margin: 2.5%;
}

ion-item {
  --border-color: transparent;
  --background: transparent;
}

ion-label{
  margin: 20px;
}

  ion-back-button {
    --color: #40bfff;
  }
</style>

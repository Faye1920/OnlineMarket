<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Annuler</ion-button>
        </ion-buttons>
        <ion-title>Courriel</ion-title>
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
              label="Entrez votre nouveau courriel"
              error-text="Invalid email"
              v-model="name"
              placeholder="Votre courriel"></ion-input>
          </ion-item>
    
    
             <ion-item>
               <ion-input
                ref="inputRef"
                v-model="passwordLogin"
                label="Mot de passe du compte"
                label-placement="floating"
                placeholder="Entrez votre mot de passe"
                error-text="Invalid password"
                type="password"
                id="motDePasse"></ion-input>
             </ion-item>
            <!-- <ion-label slot="end">oublié mot de passe?</ion-label> -->
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
  IonInput,
  modalController,
  onIonViewWillEnter,
  IonLabel,
  IonRow,
  IonAvatar,
  IonList,
  IonGrid,
  IonPage
} from '@ionic/vue';
import { onMounted, ref } from 'vue';

const name = ref();
const inputRef = ref();
const courriel = ref('');

const cancel = () => modalController.dismiss(null, 'cancel');


const confirm = () => {
  if (validateEmail(name.value)) {
    modalController.dismiss(name.value, 'confirm');
  } else {
    console.error("L'e-mail n'est pas valide");
  }
};

function validateEmail(email: any) {
  return email.match(
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  );
}

function validate(ev: any) {
  const value = ev.target.value;

  console.log(value);

  inputRef.value.$el.classList.remove('ion-valid');
  inputRef.value.$el.classList.remove('ion-invalid');

  if (value === '') return;

  validateEmail(value) ? inputRef.value.$el.classList.add('ion-valid') : inputRef.value.$el.classList.add('ion-invalid');
}

function markTouched() {
  inputRef.value.$el.classList.add('ion-touched');
}

onMounted(async () => {
  const userData = await getUserData();

  if (userData) {
    
    courriel.value = userData.email;
  }
});
</script>

<style scoped>
ion-input{ 
  --border-color: #000 ; 
}

ion-grid{
  margin-top: 25%;
}

ion-label{
  margin: 20px;
}

ion-img{
  width: 50%;
  height: 50%;
}

ion-item {
  --border-color: transparent; /* This will remove the border color */
  --background: transparent; /* This ensures no background is set for the item */
}

ion-button{
  margin: 5%;
}

  ion-back-button {
    --color: #40bfff;
  }
</style>



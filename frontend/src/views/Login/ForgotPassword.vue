<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" expand="full">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Réinitialiser</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">

        <ion-img src="https://bpdbggnwlkpuggqlguqf.supabase.co/storage/v1/object/public/annoncesImages/images-du-site/logo_blue.png"
                 alt="PhoneArena logo"></ion-img>

        <ion-row style="margin: 20px 0;">
          <ion-col size="12">
            <ion-text class="title">Mot de passe oublié?</ion-text>
          </ion-col>
          <ion-col size="12">
            <ion-text class="description">Entrez votre email ci-dessous pour réinitialiser votre mot de passe</ion-text>
          </ion-col>
        </ion-row>

        <ion-input v-model="email" label="Courriel" label-placement="floating" fill="outline"
                   placeholder="Entrez votre courriel" style="margin-bottom: 10px;"></ion-input>

        <ion-row class="ion-justify-content-center" style="margin-bottom: 20px;">
          <ion-col size="12" class="button-col">
            <ion-button v-if="!emailConfirmed" @click="resetPassword" expand="block"
                        style="height: 50px; --background: #40bfff;">Soumettre</ion-button>
          </ion-col>
            <!-- Success Message -->
        <div v-if="emailConfirmed" class="success-message">
          Email de réinitialisation envoyé avec succès. Vérifiez votre boîte mail.
        </div>
        </ion-row>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonText, IonRow, IonCol, IonButton, IonInput, IonImg, IonToolbar, IonBackButton, IonButtons, IonTitle, IonHeader } from '@ionic/vue';
import { supabase } from "../../bdd/client/system/supabase";

const router = useRouter();
const email = ref('');
const emailConfirmed = ref(false);

const resetPassword = async () => {
  if (email.value.trim() === '') {
    alert('Please enter your email address.');
    return;
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value);
    if (error) {
      console.error('Error sending reset password email:', error);
      alert(error.message);
    } else {
      emailConfirmed.value = true;
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    alert('An unexpected error occurred.');
  }
};
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 20px;
  right: 20px;
  margin: 80px 0;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
}
#container {
  text-align: center;
  position: absolute;
  left: 20px;
  right: 20px;
  margin: 80px 0;
}

#container ion-img {
  width: 100px;
  height: 100px;
  margin: 20px auto;
}

#container ion-input {
  margin-bottom: 20px;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: black;
}

.description {
  font-size: 14px;
  color: gray;
  margin-bottom: 20px;
}

.button-col {
  padding: 20px 0;
  margin-bottom: 20px;
}

#container ion-input {
  margin-bottom: 20px;
  color: gray;
  border-radius: 10px;
  border: 1px solid gray;
}

ion-row {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
  
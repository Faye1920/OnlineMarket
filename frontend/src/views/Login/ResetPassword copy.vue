<template>
  <ion-page>
    <ion-content :fullscreen="true" style="--background: white">
      <div id="container">
        <ion-img
          src="https://bpdbggnwlkpuggqlguqf.supabase.co/storage/v1/object/public/annoncesImages/images-du-site/logo_blue.png"
          style="width: 20%; height: 20%"
          alt="PhoneArena logo"
        ></ion-img>

        <ion-row style="margin: 20px 0">
          <ion-col size="12">
            <ion-text class="title">Réinitialisez votre mot de passe</ion-text>
          </ion-col>
          <ion-col size="12">
            <ion-text class="description">Veuillez saisir votre courriel</ion-text>
          </ion-col>
        </ion-row>

        <ion-input
          v-model="email"
          label="Entrez votre adresse courriel"
          label-placement="floating"
          fill="outline"
          placeholder="Entrez votre adresse courriel"
          type="email"
          style="margin-bottom: 10px"
        ></ion-input>

        <ion-row class="ion-justify-content-center" style="margin-bottom: 20px">
          <ion-col size="12" class="button-col">
                <ion-button @click="resetPassword" expand="block" style="height: 50px; --background: #40bfff;">Soumettre</ion-button>
          </ion-col>
        </ion-row>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/bdd/client/system/supabase";
import {
  IonPage,
  IonContent,
  IonText,
  IonRow,
  IonCol,
  IonButton,
  IonInput,
  IonImg,
} from "@ionic/vue";

const router = useRouter();
const email = ref();


const goToLoginPage = () => {
  router.push("/LoginPage");
};
const { data, error } = await supabase.auth.updateUser({
  password: new_password
})

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
      alert('Please check your email to reset your password.');
      router.push('/LoginPage');
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

#container ion-img {
  width: 50%;
  height: 50%;
  margin: 20px auto;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: black;
}

#container ion-input {
  margin-bottom: 20px;
  color: gray;
  border-radius: 10px;
  /* border: 1px solid gray; */
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

ion-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ion-text-end {
  font-size: 15px;
  font-weight: bold;
  color: #40bfff;
  align-items: center;
}
</style>

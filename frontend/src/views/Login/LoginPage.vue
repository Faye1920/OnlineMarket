<template>
  <ion-page>
    <ion-content class="content">
      <div id="container">
        <ion-img src="https://bpdbggnwlkpuggqlguqf.supabase.co/storage/v1/object/public/annoncesImages/images-du-site/logo_blue.png" alt="PhoneArena logo"></ion-img>
        <h2 class="title">Bienvenue sur PhoneArena</h2>
        <p class="description">Connectez-vous pour continuer</p>

        <ion-input v-model="courrielLogin" label="Courriel" label-placement="floating" fill="outline" placeholder="Entrez votre courriel" type="email"></ion-input>
        <ion-input v-model="passwordLogin" label="Mot de passe" label-placement="floating" fill="outline" placeholder="Entrez votre mot de passe" type="password"></ion-input> 

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <ion-button @click="login" class="login-button" expand="block">Connexion</ion-button>
        <p @click="goToForgotPage" class="link-text">Mot de passe oublié?</p>
        <p @click="goToRegisterPage" class="link-text">Pas de Compte? Inscrivez-vous</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { useRouter } from "vue-router";
import { sessionActuelle, supabase, userId } from "../../bdd/client/system/supabase";
import { IonPage, IonContent, IonButton, IonInput, IonImg, onIonViewWillEnter } from "@ionic/vue";

const router = useRouter();
const courrielLogin = ref("");
const passwordLogin = ref("");
const errorMessage = ref("");

const goToRegisterPage = () => {router.push("/RegisterPage");};
const goToForgotPage = () => {router.push("/ForgotPassword");};

async function resetFields() {
  courrielLogin.value = "";
  passwordLogin.value = "";
  errorMessage.value = "";
}

async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log("Error logging out:", error.message);
  } else {
    console.log("User logged out successfully");
  }
}

async function login() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: courrielLogin.value,
      password: passwordLogin.value,
    });

    if (error) {
      console.log("Login error:", error.message);
      errorMessage.value = error.message;
    } else {
      console.log("Login successful:", data);
      router.push("/HomePage");
    }
  } catch (error) {
    console.error("An unexpected error occurred during login:", error);
    errorMessage.value = "Something went wrong";
  }
}

onIonViewWillEnter(() => {
  resetFields();
  // console.log("HomePage will enter");
  logout();
  sessionActuelle();
  userId();
});
</script>

<style scoped>
.content {
  --background: white;
}

#container {
  text-align: center;
  padding: 4%;
  margin-top: 6%;
}

ion-img {
  width: 100px;
  height: 100px;
  margin: 20px auto;
}

ion-input {
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid gray;
  text-align: left;
  color: gray;

}

.title, .description {
  margin-bottom: 15px;
}

.title {
  font-size: 22px;
  font-weight: bold;
}

.description {
  font-size: 14px;
  color: gray;
}

.error-message {
  color: red;
  margin-bottom: 15px;
}

.login-button {
  height: 50px;
  --background: #40bfff;
  width: 100%;
  border-radius: 10px;
}

.link-text {
  margin-top: 8%;
  font-size: 14px;
  color: gray;
  cursor: pointer;
}
</style>

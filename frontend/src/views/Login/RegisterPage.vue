<template>
  <ion-page>
    <ion-content :fullscreen="true" style="--background: white">

      <div id="container">
        <ion-img
          src="https://bpdbggnwlkpuggqlguqf.supabase.co/storage/v1/object/public/annoncesImages/images-du-site/logo_blue.png"
          alt="PhoneArena logo"></ion-img>

        <ion-row style="margin: 20px 0">
          <ion-col size="12">
            <ion-text class="title">Nouvel utilisateur</ion-text>
          </ion-col>
          <ion-col size="12">
            <ion-text class="description">Créer un nouveau compte</ion-text>
          </ion-col>
        </ion-row>


        <ion-input v-model="courriel" label="Courriel" label-placement="floating" fill="outline" placeholder="Entrez votre courriel" style="margin-bottom: 10px" class="userInput">
        </ion-input>
        <ion-input v-model="prenom" label="Prénom" label-placement="floating" fill="outline" placeholder="Entrez votre prénom" style="margin-bottom: 10px" class="userInput">
        </ion-input>
        <ion-input v-model="nom" label="Nom" label-placement="floating" fill="outline" placeholder="Entrez votre nom" style="margin-bottom: 10px" class="userInput">
        </ion-input>
        <ion-input readonly :value="addressDisplay" @click="openAddressModal" style="margin-bottom: 10px" label="Address" fill="outline" class="adressModal">
        </ion-input>
        <ion-input v-model="password" label="Mot de passe" label-placement="floating" fill="outline" placeholder="Entrez votre mot de passe" type="password" style="margin-bottom: 10px" class="userInput" >
        </ion-input>
        <ion-input v-model="confirmPassword" label="Confirmer le mot de passe" label-placement="floating" fill="outline" placeholder="Entrez votre mot de passe" type="password" style="margin-bottom: 10px" class="userInput">
        </ion-input>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <ion-row class="ion-justify-content-center" style="margin-bottom: 20px">
          <ion-col size="12" class="button-col">
            <ion-button
              @click="createAccount"
              expand="block"
              style="height: 50px; --background: #40bfff"
              >S'inscrire</ion-button>
          </ion-col>
        <p class="userInput">
          <ion-text @click="goToLoginPage" color="black">Avez-vous déjà un compte? Se connecter</ion-text>
        </p>
        </ion-row>
      </div>

      <AddressModal :isOpen="isAddressModalOpen" @close="closeAddressModal" @submitAddress="handleAddressSubmit"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import router from "../../router";
import { computed, ref } from "vue";
import AddressModal from "../Components/AddressModal.vue";
import { supabase } from "../../bdd/client/system/supabase";
import {IonPage,IonContent,IonText,IonRow,IonCol,IonButton,IonInput,IonImg} from "@ionic/vue";

const nom = ref("");
const prenom = ref("");
const courriel = ref("");
const password = ref("");
const errorMessage = ref("");
const confirmPassword = ref("");
const isAddressModalOpen = ref(false);

const address = ref({
  numeroCivique: "",
  rue: "",
  ville: "",
  codePostal: "",
  province:"",
  pays: "",
});


const goToLoginPage = () => {resetForm();router.push("/LoginPage")};

const resetForm = () => {
  prenom.value = "";
  nom.value = "";
  courriel.value = "";
  password.value = "";
  confirmPassword.value = "";
  errorMessage.value = "";
  address.value = {
    numeroCivique: "",
    rue: "",
    ville:"",
    codePostal: "",
    province: "",
    pays: "",
  };
};

async function createAccount() {
  if (
    !courriel.value ||
    !password.value ||
    !confirmPassword.value ||
    !nom.value ||
    !prenom.value ||
    !address.value
  ) {
    errorMessage.value = "Please fill in all fields";
    return errorMessage.value;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(courriel.value)) {
    errorMessage.value = "Please enter a valid email address";
    return errorMessage.value;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return errorMessage.value;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: courriel.value,
      password: password.value,
      options: {
        data: {
          first_name: prenom.value,
          last_name: nom.value,
          address_number: address.value.numeroCivique,
          address_street: address.value.rue,
          address_city: address.value.ville,
          address_postal_code: address.value.codePostal,
          address_province: address.value.province,
          address_country: address.value.pays,
        },
      },
    });

    if (error) {
      console.log("Error during account creation:", error.message);
    } else {
      console.log("Account created successfully", data);
      goToLoginPage();
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
}

const openAddressModal = () => {
  isAddressModalOpen.value = true;
};
const closeAddressModal = () => {
  isAddressModalOpen.value = false;
};

const handleAddressSubmit = (submittedAddress: {
  numeroCivique: string;
  rue: string;
  ville: string
  codePostal: string;
  province: string;
  pays: string;
}) => {
  address.value = submittedAddress;
  closeAddressModal();
};

const addressDisplay = computed(() => {
  if (address.value) {
    return `${address.value.numeroCivique} ${address.value.rue}, ${address.value.ville}, ${address.value.codePostal}, ${address.value.province}, ${address.value.pays}`;
  }
  return "";
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 2.5%;
  right: 2.5%;
  margin: 2%;
  margin-top: 6%;
  margin-bottom: 6%;
}

#container ion-img {
  width: 25%;
  height: 25%;
  margin: 20px auto;
}


#container ion-input {
  margin-bottom: 20px;
  color: gray;
  border-radius: 10px; 
  border: 1px solid gray;
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

.userInput {
  font-size: 15;
  color: gray;
  margin-bottom: 50px;
}

.error-message {
  color: red;
  margin-bottom: 10px;
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

.adressModal{
  height: 55px;
}

</style>
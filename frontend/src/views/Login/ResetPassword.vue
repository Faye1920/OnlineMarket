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
            <ion-text class="description">Veuillez saisir votre nouveau mot de passe</ion-text>
          </ion-col>
        </ion-row>

        <ion-input
          v-model="newPassword"
          label="Nouveau mot de passe"
          label-placement="floating"
          fill="outline"
          placeholder="Mot de passe"
          type="email"
          style="margin-bottom: 10px"
        ></ion-input>

          <ion-input
          v-model="confirmPassword"
          label="Confirmer votre nouveau mot de passe"
          label-placement="floating"
          fill="outline"
          placeholder="Confirmer le mot de passe"
          type="email"
          style="margin-bottom: 10px"
        ></ion-input>

        <ion-row class="ion-justify-content-center" style="margin-bottom: 20px">
          <ion-col size="12" class="button-col">
                <ion-button @click="updatePassword" expand="block" style="height: 50px; --background: #40bfff;">Soumettre</ion-button>
                 <ion-button @click="updatePassword" expand="block" style="height: 50px; --background: #40bfff;">Soumettre</ion-button>
          </ion-col>
              <!-- Success Message -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        </ion-row>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonPage,IonContent,IonInput,IonButton,IonCol,IonRow,IonText,IonImg} from '@ionic/vue';
import { supabase } from '../../bdd/client/system/supabase';
import { useRouter } from 'vue-router';

const newPassword = ref('');
const confirmPassword = ref('');
const router = useRouter();
const successMessage = ref('');

const updatePassword = async () => {
 if (newPassword.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas.');
    return;
 }

 const params = new URLSearchParams(window.location.search);
 const recoveryToken = params.get('recovery_token');
 console.log(window.location);
  console.log(recoveryToken)

 if (!recoveryToken) {
    alert('Invalid recovery token.');
    return;
 }

 try {
    const { error } = await supabase.auth.updateUser(recoveryToken, { password: newPassword.value });

    if (error) throw error;

    successMessage.value = 'Votre mot de passe a été mis à jour avec succès.';
    setTimeout(() => {
      successMessage.value = '';
      router.push('/LoginPage');
    }, 1000);
 } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    alert(error.message);
 }
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const recoveryToken = params.get('recovery_token');
  console.log(window.location);
  console.log(recoveryToken);
});

</script>


<style scoped>
.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  text-align: center;
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
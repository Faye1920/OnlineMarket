<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Annuler</ion-button>
        </ion-buttons>
        <ion-title>Adresse</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content class="ion-padding">
       <div class="address-container">
    <ion-card class="address-card">
      <ion-card-content>
        <ion-list lines="full">
          <ion-item>
            <ion-label position="stacked">Numéro civique</ion-label>
            <ion-note slot="end">{{ addressData.numeroCivique }}</ion-note>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">La rue</ion-label>
            <ion-note slot="end">{{ addressData.rue }}</ion-note>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Ville</ion-label>
            <ion-note slot="end">{{ addressData.ville }}</ion-note>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Code Postal</ion-label>
            <ion-note slot="end">{{ addressData.codePostal }}</ion-note>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Province</ion-label>
            <ion-note slot="end">{{ addressData.province }}</ion-note>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Pays</ion-label>
            <ion-note slot="end">{{ addressData.pays }}</ion-note>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>
  </div>

    <ion-button expand="full" shape="round" @click="openAddressModal" style="height: 50px; --background: #40bfff" class="ajouterButton">
        Ajouter / Modifier l'adresse
    </ion-button>

      <ion-row class="ion-justify-content-center" style="margin-bottom: 20px">
          <ion-col size="12" class="button-col">
            <ion-button
              @click="confirm"
              expand="block"
              style="height: 50px; --background: #40bfff"
              shape="round">Sauvegarder</ion-button
            >
          </ion-col>
        </ion-row>
        
       <AddressModal
    :isOpen="isAddressModalOpen"
    :currentAddress="addressData"
    @close="closeAddressModal"
    @submitAddress="handleAddressSubmit"
    />
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
  IonPage,
  modalController,
  IonRow,
  IonItem,
  IonLabel,
  IonCol,
  IonCard,
  IonCardContent,
  IonText,
  IonList,
  IonNote,
onIonViewWillEnter
} from "@ionic/vue";
import { onMounted, ref, watch } from "vue";
import AddressModal from "@/views/Components/AddressModal.vue";
import { getUserData, getUserId, updateUserData, userId } from "@/bdd/client/system/supabase";

const isAddressModalOpen = ref(false);
const addressData = ref({
  numeroCivique: '',
  rue: '',
  ville: '',
  codePostal: '',
  province: '',
  pays: ''
});



const cancel = () => modalController.dismiss(null, 'cancel');

const confirm = async () => {
  try {
    const userId = await getUserId(); // Fetch the current user's ID
    if (!userId) {
      throw new Error("User ID not found");
    }

    const updatedData = {
      address_number: addressData.value.numeroCivique,
      address_street: addressData.value.rue,
      address_city: addressData.value.ville,
      address_postal_code: addressData.value.codePostal,
      address_province: addressData.value.province,
      address_country: addressData.value.pays,
    };

    await updateUserData(updatedData);
    console.log("Address updated successfully");
  } catch (error) {
    console.error("Error updating address:", error);
  }
};


const openAddressModal = () => {
  isAddressModalOpen.value = true;
};

const closeAddressModal = () => {
  isAddressModalOpen.value = false;
};

const handleAddressSubmit = async (newAddressData: { numeroCivique: string; rue: string; ville: string; codePostal: string; province: string; pays: string; }) => {
  addressData.value = newAddressData; // Update the local data
  await confirm(); // Call confirm to update the user's data
  closeAddressModal(); // Close the modal after updating
};


onMounted(async () => {
  const userData = await getUserData();
  if (userData) {
    addressData.value = {
      numeroCivique: userData.address_number || 'N/A',
      ville: userData.address_city || 'N/A',
      rue: userData.address_street || 'N/A',
      codePostal: userData.address_postal_code || 'N/A',
      province: userData.address_province || 'N/A',
      pays: userData.address_country || 'N/A'
    };
  }
});


watch(addressData, (newValue, oldValue) => {
  console.log("Address data changed:", newValue);
}, { deep: true });
</script>


<style scoped>

ion-note[slot="end"] {
  font-weight: bold;
  text-align: right;
}

.address-container {
  padding: 6px;
}

.ajouterButton{
  margin-left: 20px;
  margin-right: 20px;
}

  ion-back-button {
    --color: #40bfff;
  }
</style>
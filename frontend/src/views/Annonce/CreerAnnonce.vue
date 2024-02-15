<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start" expand="full">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title aria-label="annonce">Créer une annonce</ion-title>
        <ion-icon :icon="duplicateOutline" slot="end" class="iconToolbar"></ion-icon>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="form-container">
        <div class="image-card">
          <ion-thumbnail>
            <ion-img id="open-modal" expand="block" :src="firstPhotoUrl"></ion-img>
          </ion-thumbnail>
        </div>
        <div v-if="photoError" class="error-message">{{ photoError }}</div>

        <ion-item class="labelSize">
          <ion-input v-model="title" label="Entrez le titre" label-placement="floating" placeholder="Titre" type="text" :maxlength="titleMaxLength"></ion-input>
        </ion-item>
        <div v-if="titleError" class="error-message">{{ titleError }}</div>

        <ion-item class="labelSize" @click="openBrandModal">
          <ion-label>{{ selectedBrand }}</ion-label>
        </ion-item>
        <div v-if="brandError" class="error-message">{{ brandError }}</div>

        <ion-item class="labelSize" @click="openModelModal">
          <ion-label>{{ selectedModel }}</ion-label>
        </ion-item>
        <div v-if="modelError" class="error-message">{{ modelError }}</div>

        <ion-item class="userInput descriptionInput">
          <ion-input v-model="description" label="Remplir la description" label-placement="floating" placeholder="Description (Recommandée)" type="text" :maxlength="400"></ion-input>
          <div class="char-count">{{ descriptionLength }}/400</div>
        </ion-item>
        <div v-if="descriptionError" class="error-message">{{ descriptionError }}</div>

        <ion-item class="labelSize" @click="openBrandModal">
          <ion-label>{{ selectedBrand }}</ion-label>
        </ion-item>
        <div v-if="brandError" class="error-message">{{ brandError }}</div>

        <ion-item class="labelSize" @click="openModelModal">
          <ion-label>{{ selectedModel }}</ion-label>
        </ion-item>
        <div v-if="modelError" class="error-message">{{ modelError }}</div>
        <ion-item class="labelSize">
          <ion-label aria-label="ram" placeholder="Ram">Ram</ion-label>
          <ion-select v-model="ramSelected" placeholder="Ram">
            <ion-select-option v-for="ram in ramModels" :value="ram" :key="ram">{{ ram }}</ion-select-option>
          </ion-select>
        </ion-item>
        <div v-if="ramError" class="error-message">{{ ramError }}</div>

        <ion-item class="labelSize">
          <ion-label aria-label="memoire">Mémoire</ion-label>
          <ion-select v-model="storageSelected" placeholder="Storage">
            <ion-select-option v-for="storage in storageModels" :value="storage" :key="storage">{{ storage }}</ion-select-option>
          </ion-select>
        </ion-item>
        <div v-if="storageError" class="error-message">{{ storageError }}</div>

        <ion-item class="labelSize">
          <ion-input v-model="price" label="Le prix désiré" label-placement="floating" placeholder="Ex: 500.00" type="number"></ion-input>
        </ion-item>
        <div v-if="priceError" class="error-message">{{ priceError }}</div>

        <ion-item>
          <ion-label>État</ion-label>
          <ion-row>
            <ion-button v-for="stateOption in stateOptions" :key="stateOption.value" :color="stateSelected === stateOption.value ? 'primary' : 'medium'" @click="selectState(stateOption.value)">
              {{ stateOption.label }}
            </ion-button>
          </ion-row>
        </ion-item>
        <div v-if="stateError" class="error-message">{{ stateError }}</div>

        <ion-item class="quantity-item">
          <ion-label>Quantité</ion-label>
          <ion-row class="quantity-row">
            <ion-col size="3" class="quantity-col">
              <ion-button fill="clear" @click="decrementQuantity">
                <ion-icon :icon="removeSharp"></ion-icon>
              </ion-button>
            </ion-col>
            <ion-col size="6" class="quantity-display">{{ quantity }}</ion-col>
            <ion-col size="3" class="quantity-col">
              <ion-button fill="clear" @click="incrementQuantity">
                <ion-icon :icon="addSharp"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-item>
        <div v-if="quantityError" class="error-message">{{ quantityError }}</div>
      </div>

      <ion-footer>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12">
            <ion-button expand="block" style="height: 50px; --background: #40bfff" @click="submitForm">Afficher l'annonce</ion-button>
          </ion-col>
        </ion-row>
      </ion-footer>

      <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-title>Photos</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="confirm()">Fermer</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-grid>
            <ion-row>
              <ion-col size="6" v-for="(photo, index) in photos" :key="index">
                <ion-img :src="photo.webviewPath" @click="showActionSheet(photo)"></ion-img>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-fab vertical="bottom" horizontal="start" slot="fixed">
            <ion-fab-button @click="takePhoto()" style="--background: #40bfff">
              <ion-icon :icon="camera"></ion-icon>
            </ion-fab-button>
          </ion-fab>
          <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button @click="uploadPhotoD()" style="--background: #40bfff">
              <ion-icon :icon="cloudUpload"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-content>
      </ion-modal>
      <ion-toast :is-open="showToast" :message="toastMessage" duration="2000" @ionToastDidDismiss="() => (showToast = false)"></ion-toast>

      <ModalComponent :isOpen="isBrandModalOpen" :items="brands" title="Select Brand" @select="handleBrandSelect" @close="closeBrandModal" />
      <ModalComponent :isOpen="isModelModalOpen" :items="models" title="Select Model" @select="handleModelSelect" @close="closeModelModal" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import router from "@/router";
import { onMounted, ref, computed } from "vue";
import { Geolocation } from "@capacitor/Geolocation";
import { OverlayEventDetail } from "@ionic/core/components";
import ModalComponent from "../Components/ModalComponent.vue";
import { camera, trash, close, cloudUpload, addSharp, removeSharp, duplicateOutline } from "ionicons/icons";
import { usePhotoGallery, UserPhoto } from "@/camera/usePhotoGallery";
import { fetchBrands, fetchModele, fetchModelsByBrand, fetchRamModel, fetchStorageModel, creerAnnonce } from "../../bdd/client/system/supabase";
import { IonButtons, IonContent, IonHeader, IonBackButton, IonPage, IonTitle, IonToolbar, IonItem, IonIcon, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonRow, IonThumbnail, IonImg, IonModal, actionSheetController, IonCol, IonFab, IonFabButton, IonGrid, IonFooter, IonToast } from "@ionic/vue";

const { photos, takePhoto, deletePhoto, uploadPhoto } = usePhotoGallery();
const message = ref("This modal example uses triggers to automatically open a modal when the button is clicked.");
const modal = ref();

const selectedBrand = ref("Choisir la marque");
const selectedModel = ref("Choisir le modèle");

const isBrandModalOpen = ref(false);
const isModelModalOpen = ref(false);

const showToast = ref(false);
const toastMessage = ref("");
const title = ref("");
const description = ref("");
const ramSelected = ref("");
const price = ref<string>("");
const stateSelected = ref("");
const titleMaxLength = ref(50);
const storageSelected = ref("");
const titleError = ref("");
const brandError = ref("");
const modelError = ref("");
const descriptionError = ref("");
const ramError = ref("");
const storageError = ref("");
const priceError = ref("");
const stateError = ref("");
const quantityError = ref("");
const photoError = ref("");

const brands = ref<string[]>([]);
const models = ref<string[]>([]);
const ramModels = ref<string[]>([]);
const storageModels = ref<string[]>([]);

const descriptionLength = computed(() => description.value.length);
const firstPhotoUrl = computed(() => {
  return photos.value.length > 0 ? photos.value[0].webviewPath : "https://www.shutterstock.com/image-vector/premium-picture-icon-logo-line-600nw-749843974.jpg";
});

const stateOptions = [
  { label: "Neuf", value: "new" },
  { label: "Presque neuf", value: "used" },
  { label: "Usagé", value: "usage" },
  { label: "Très usager", value: "tresUsage" },
];

const quantity = ref(1);

const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 0) {
    quantity.value--;
  }
};

const getUserAnnonceLocation = async () => {
  const coordinates = await Geolocation.getCurrentPosition();
  const lat = coordinates.coords.latitude;
  const lon = coordinates.coords.longitude;
  return {
    lat: lat,
    lon: lon,
  };
};

const selectState = (value: string) => {
  stateSelected.value = value;
};

const openBrandModal = () => {
  console.log("openBrandModal");
  isBrandModalOpen.value = true;
};

const closeBrandModal = () => {
  console.log("closeBrandModal");
  isBrandModalOpen.value = false;
};

const openModelModal = () => {
  console.log("openModelModal");
  isModelModalOpen.value = true;
};

const closeModelModal = () => {
  console.log("closeModelModal");
  isModelModalOpen.value = false;
};

const handleBrandSelect = async (brand: string) => {
  selectedModel.value = "Choisir le modèle";
  let filteredModels: string[] = [];
  console.log("handleBrandSelect", brand);
  selectedBrand.value = brand;
  closeBrandModal();
  filteredModels = [];
  filteredModels = await fetchModelsByBrand(brand);
  models.value = filteredModels;
};

const handleModelSelect = async (model: string) => {
  console.log("handleModelSelect", model);
  selectedModel.value = model;
  ramModels.value = await fetchRamModel(selectedBrand.value, selectedModel.value);
  storageModels.value = await fetchStorageModel(selectedBrand.value, selectedModel.value);
  closeModelModal();
};

async function submitForm() {
  titleError.value = "";
  brandError.value = "";
  modelError.value = "";
  descriptionError.value = "";
  ramError.value = "";
  storageError.value = "";
  priceError.value = "";
  stateError.value = "";
  quantityError.value = "";
  photoError.value = "";

  if (!title.value || title.value.trim() === "") {
    titleError.value = "Veuillez entrer un titre.";
  }
  if (selectedBrand.value === "Choisir la marque") {
    brandError.value = "Veuillez sélectionner une marque.";
  }
  if (selectedModel.value === "Choisir le modèle") {
    modelError.value = "Veuillez sélectionner un modèle.";
  }
  if (!description.value || description.value.trim() === "") {
    descriptionError.value = "Veuillez entrer une description.";
  }
  if (!ramSelected.value || ramSelected.value === "") {
    ramError.value = "Veuillez sélectionner la RAM.";
  }
  if (!storageSelected.value || storageSelected.value === "") {
    storageError.value = "Veuillez sélectionner le stockage.";
  }
  const priceValue = parseFloat(price.value);
  if (isNaN(priceValue) || priceValue <= 0) {
    priceError.value = "Veuillez entrer un prix valide.";
  }
  if (!stateSelected.value || stateSelected.value === "") {
    stateError.value = "Veuillez sélectionner un état.";
  }
  if (quantity.value <= 0) {
    quantityError.value = "La quantité doit être supérieure à 0.";
  }
  if (photos.value.length === 0 || firstPhotoUrl.value === "https://www.shutterstock.com/image-vector/premium-picture-icon-logo-line-600nw-749843974.jpg") {
    photoError.value = "Veuillez télécharger au moins une photo.";
  }

  if (titleError.value || brandError.value || modelError.value || descriptionError.value || ramError.value || storageError.value || priceError.value || stateError.value || quantityError.value || photoError.value) {
    return;
  }
  const photoUrls = await uploadPhoto();
  const currentPosition = await getUserAnnonceLocation();
  if (!currentPosition) {
    console.error("Unable to get current position");
    return;
  }

  const formData = {
    image: photoUrls,
    brand: selectedBrand.value,
    model: selectedModel.value,
    description: description.value,
    ram: ramSelected.value,
    storage: storageSelected.value,
    price: price.value || "",
    state: stateSelected.value,
    quantity: quantity.value,
    title: title.value,
    geolocation_annonce: currentPosition,
  };

  try {
    await creerAnnonce(formData);
    console.log("Form Data:", formData);
    selectedBrand.value = "Choisir la marque";
    selectedModel.value = "Choisir le modèle";
    description.value = "";
    ramSelected.value = "";
    storageSelected.value = "";
    price.value = "";
    stateSelected.value = "";
    quantity.value = 1;
    title.value = "";
    photos.value = [];
    toastMessage.value = "Annonce créer avec succès!";
    showToast.value = true;
    router.push("/AnnoncePage");
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

const uploadPhotoD = async () => {
  try {
    const photoUrls = await uploadPhoto();
    console.log("Uploaded Photo URLs:", photoUrls);
    if (photoUrls && photoUrls.length > 0) {
      confirm();
    }
  } catch (error) {
    console.error("Error during photo upload:", error);
  }
};

const confirm = async () => {
  try {
    toastMessage.value = "Photo sauvegarder!";
    showToast.value = true;
    router.push("/CreerAnnonce");
  } catch (error) {
    console.error("Error uploading photos:", error);
  }
  modal.value.$el.dismiss("confirm");
};

const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
  if (ev.detail.role === "confirm") {
    message.value = `Hello, ${ev.detail.data}!`;
  }
};

const showActionSheet = async (photo: UserPhoto) => {
  const actionSheet = await actionSheetController.create({
    header: "Photos",
    buttons: [
      {
        text: "Delete",
        role: "destructive",
        icon: trash,
        handler: () => {
          deletePhoto(photo);
        },
      },
      {
        text: "Cancel",
        icon: close,
        role: "cancel",
        handler: () => {},
      },
    ],
  });
  await actionSheet.present();
};

onMounted(async () => {
  brands.value = await fetchBrands();
  models.value = await fetchModele();
});
</script>

<style scoped>
.form-container {
  --padding-start: 10px;
  --padding-end: 10px;
  padding: 2vw;
}

.labelSize {
  display: block;
  padding: 0px 15px;
  border: 1px solid gray;
  border-radius: 4px;
  background-color: white;
  --padding-start: 0;
  --padding-end: 0;
  margin: 18px;
  height: auto;
}

.quantity-item {
  margin: 1em 0;
}

.quantity-row {
  justify-content: center;
}

@media (max-width: 768px) {
  .nameImage,
  .descriptionInput,
  .phone-details-header {
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .nameImage,
  .descriptionInput,
  .phone-details-header {
    font-size: 0.8em;
  }
}

@media (max-width: 768px) {
  ion-modal {
    --width: 95%;
    --height: 95%;
  }
}

.quantity-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.quantity-display {
  text-align: center;
  font-size: 1.2em;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nameImage {
  margin-left: 30px;
  text-align: right;
  font-weight: bolder;
  font-size: inherit;
}

ion-input,
ion-select {
  --padding-start: 0;
  --padding-end: 0;
}

.descriptionInput {
  height: 100px;
  border: 1px solid gray;
  border-radius: 6px;
  --padding-start: 8px;
  --padding-end: 8px;
  margin: 18px;
  font-weight: normal;
  font-size: inherit;
}

ion-item {
  --border-width: 0;
  --inner-border-width: 0;
}

.iconToolbar {
  margin: 5px;
  height: 25px;
  width: 25px;
  color: #000;
}

ion-modal {
  --width: 90%;
  --height: 90%;
}

ion-toggle {
  --background-checked: #40bfff;
}

ion-fab-button {
  color: #40bfff;
}

.quantity-col ion-button {
  color: #40bfff;
}

.char-count {
  position: absolute;
  bottom: 34px;
  right: 2px;
  color: gray;
  font-size: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0 5px;
  border-radius: 5px;
}
ion-back-button {
  --color: #40bfff;
}

ion-img {
  height: 70vw;
  width: 100vw;
}
ion-thumbnail {
  height: auto;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.image-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
  overflow: hidden;
}

ion-img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.error-message {
  color: red;
  font-size: 0.8em;
  margin: 18px;
}
</style>

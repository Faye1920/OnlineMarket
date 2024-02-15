<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Add location</ion-title>
        <ion-icon :icon="mapOutline" slot="end" class="iconToolbar"></ion-icon>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <div id="map" ref="mapRef" class="map-container"></div>
        <ion-card-content>
          <ion-item lines="none">
            <ion-label v-if="currentPosition.region">{{ currentPosition.region }} | Rayon: {{ userRaduis }} km</ion-label>
          </ion-item>
          <ion-list>
            <ion-radio-group v-model="radiusType">
              <ion-item lines="none">
                <ion-label>Rayon par défault (Géolocation)</ion-label>
                <ion-radio slot="start" value="default"></ion-radio>
              </ion-item>
              <ion-item lines="none">
                <ion-label>Choisir un rayon spécifique</ion-label>
                <ion-radio slot="start" value="custom"></ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>
          <ion-item v-if="radiusType === 'custom'">
            <ion-label>La distance désirée</ion-label>
            <ion-select v-model="customRadius" placeholder="Choisir un rayon" @ionChange="handleSelectChange">
              <ion-select-option v-for="radius in radiusOptions" :key="radius" :value="radius">{{ radius }} km</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-button expand="full" @click="applyRadius">Appliquer le rayon</ion-button>
        </ion-card-content>
      </ion-card>
      <ion-toast :is-open="showToast" :message="toastMessage" duration="2000" @ionToastDidDismiss="() => (showToast = false)"></ion-toast>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { onMounted, ref } from "vue";
import { mapOutline } from "ionicons/icons";
import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/Geolocation";
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, IonList, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonToast, IonCardContent,IonCard,IonIcon } from "@ionic/vue";
import { getUserId, saveUserPreference, getUserPreference } from "@/bdd/client/system/supabase";

const mapRef = ref(null);
let googleMap: GoogleMap;
let currentCircle: string[];
const showToast = ref(false);
const toastMessage = ref("");
const customRadius = ref(500);
const radiusType = ref("default");
const userRaduis = ref('');
const currentPosition = ref({ lat: 0, lon: 0, region: "" });

const radiusOptions: any[] = [];
for (let km = 10; km <= 500; km += 10) {
  radiusOptions.push(km);
}

const getCityName = async (lat: number, lng: number) => {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC9JpISjd_1WgZNlXIa3RotuPu8homYyq8`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      for (const component of addressComponents) {
        if (component.types.includes("locality")) {
          console.log(component.long_name);
          return component.long_name;
        }
      }
      return "City not found";
    } else {
      return "Unknown location";
    }
  } catch (error) {
    console.error("Error during reverse geocoding:", error);
    return "Error fetching location";
  }
};

const getCurrentPosition = async () => {
  try {
    const coordinates = await Geolocation.getCurrentPosition();
    const region = await getCityName(coordinates.coords.latitude, coordinates.coords.longitude);
    currentPosition.value.region = region;
    return {
      lat: coordinates.coords.latitude,
      lon: coordinates.coords.longitude,
      region: region,
    };
  } catch (error) {
    console.error("Error getting current position:", error);
    return { lat: 0, lon: 0, region: "" };
  }
};


const createMap = async (lat: any, lng: any, radius: any) => {
  if (!mapRef.value) {
    console.error("Map container not available");
    return;
  }

  googleMap = await GoogleMap.create({
    id: "my-map",
    element: mapRef.value,
    apiKey: "AIzaSyC9JpISjd_1WgZNlXIa3RotuPu8homYyq8",
    config: {
      center: { lat, lng },
      zoom: calculateZoomLevel(radius),
      mapTypeId: "roadmap",
      disableDefaultUI: true,
      fullscreenControl: false,
      zoomControl: true,
    },
  });

  await googleMap.addMarker({
    coordinate: { lat, lng },
  });

  currentCircle = await googleMap.addCircles([
    {
      center: { lat, lng },
      radius: radius,
      fillColor: "#0000FF20",
      strokeColor: "#0000FF",
    },
  ]);
};


async function applyRadius() {
  const currentPosition = await getCurrentPosition();
  if (!currentPosition) {
    console.error("Unable to get current position");
    return;
  }

  let radius = radiusType.value === "custom" ? customRadius.value * 1000 : 50000;

  console.log(`Applying radius: ${radius}`);

  if (currentCircle && currentCircle.length > 0) {
    await googleMap.removeCircles(currentCircle);
  }

  currentCircle = await googleMap.addCircles([
    {
      center: {
        lat: currentPosition.lat,
        lng: currentPosition.lon,
      },
      radius: radius,
      fillColor: "#0000FF20",
      strokeColor: "#0000FF",
    },
  ]);

  const zoomLevel = calculateZoomLevel(radius);

  await googleMap.setCamera({
    coordinate: {
      lat: currentPosition.lat,
      lng: currentPosition.lon,
    },
    zoom: zoomLevel,
  });

  // Update userRadius here
  userRaduis.value = (radius / 1000).toString()

  const userID = await getUserId();
  if (!userID) {
    console.error("User ID not found");
    return;
  }

  try {
    const savedPreference = await saveUserPreference(userID, currentPosition.lat, currentPosition.lon, radius, currentPosition.region);
    if (savedPreference) {
      console.log("Saved preference", savedPreference)
      console.log("User preferences saved or updated");
    }
  } catch (error) {
    console.error("Error saving user preferences:", error);
  }
}



function calculateZoomLevel(radiusInput: any) {
  console.log("Radius:", radiusInput);

  const breakpoints = [
    { radius: 20000, zoom: 9.8},
    { radius: 30000, zoom: 9 },
    { radius: 40000, zoom: 8.5 },
    { radius: 50000, zoom: 8.2 },
    { radius: 60000, zoom: 8 },
    { radius: 70000, zoom: 7.8 },
    { radius: 90000, zoom: 7.5 },
    { radius: 100000, zoom: 7 },
    { radius: 110000, zoom: 6.5 },
    { radius: 130000, zoom: 6 },
    { radius: 256000, zoom: 5.5 },
    { radius: 360000, zoom: 5 },
    { radius: 420000, zoom: 4.2 },
    { radius: 500000, zoom: 4.5 },
  ];

  for (let i = 0; i < breakpoints.length - 1; i++) {
    const current = breakpoints[i];
    const next = breakpoints[i + 1];

    if (radiusInput < current.radius) {
      const ratio = (radiusInput - next.radius) / (current.radius - next.radius);
      const zoom = next.zoom + ratio * (current.zoom - next.zoom);

      console.log("Zoom Level:", zoom);
      return zoom;
    }
  }
  return breakpoints[breakpoints.length - 1].zoom;
}


const handleSelectChange = () => {
  toastMessage.value = `Appliquer le choix ${customRadius.value} km`;
  showToast.value = true;
};


onMounted(async () => {

  const asdsa = await getCurrentPosition();
  console.log(asdsa);
  try {
    const userId = await getUserId();
    if (!userId) {
      console.error("User ID not found");
      return;
    }
      const userPreferences = await getUserPreference(userId);
     if (userPreferences) {
  await createMap(userPreferences.lat, userPreferences.lon, userPreferences.radius);
  userRaduis.value = (userPreferences.radius / 1000).toString();
} else {
  const currentPosition = await getCurrentPosition();
  await createMap(currentPosition.lat || 0, currentPosition.lon || 0, 30000);
      } 
  } catch (error) {
    console.error("Error during onMounted execution:", error);
  }
});

</script>


<style scoped>
.map-container {
  width: 100%;
  height: 300px;
}

.iconToolbar{
  margin: 5px;
  height: 25px;
  width: 25px;
  color: #000;
}


ion-card {
  margin: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

ion-card-content {
  padding: 16px;
}

ion-back-button{
  color: #40bfff;
}
</style>

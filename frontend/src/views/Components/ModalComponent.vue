<template>
  <ion-modal :is-open="isOpen" @ionModalDidDismiss="emitClose">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emitClose">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-searchbar placeholder="Search" v-model="searchQuery" @ionChange="filterItems"></ion-searchbar>
      <ion-list>
        <ion-item v-for="item in filteredItems" :key="item" @click="emitSelect(item)">
          {{ item }}
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
  IonButton,
  IonModal,
  IonSearchbar
} from "@ionic/vue";

const props = defineProps({
  isOpen: Boolean,
  items: {
    type: Array as () => string[],
    default: () => []
  },
  title: String
});

const emits = defineEmits(['select', 'close']);

const searchQuery = ref('');

const filterItems = () => {
  if (searchQuery.value) {
    return props.items.filter(item => 
        item.toLowerCase().includes(searchQuery.value.toLowerCase()));
  } else {
    return props.items;
  }
};

const filteredItems = computed(filterItems);

const emitClose = () => {
  emits('close');
};

const emitSelect = (item: string) => {
  emits('select', item);
};
</script>

<style scoped>
</style>
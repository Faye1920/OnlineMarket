<template>
    <ion-page>
       <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>FAQ</ion-title>
      </ion-toolbar>
    </ion-header>


      <ion-content class="ion-padding">
        <ion-list>
          <ion-item-group v-for="category in faqCategories" :key="category.title" class="titleDropown">
            
            <ion-item-divider>
              {{ category.title }}
            </ion-item-divider>

            <ion-item v-for="question in category.questions" :key="question.id">
              <ion-label @click="toggleAnswer(question.id)" style="display: flex; justify-content: space-between;">
                {{ question.title }}
                <ion-icon :icon="question.open ? chevronUp : chevronDown" slot="end"></ion-icon>
              </ion-label>
              <ion-item v-show="question.open" class="answer">
                {{ question.answer }}
              </ion-item>

            </ion-item>
          
        </ion-item-group>
        </ion-list>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItemGroup, IonItemDivider, IonItem, IonLabel, IonIcon, IonButtons,IonBackButton } from "@ionic/vue";
  import { chevronUp, chevronDown} from "ionicons/icons";
  
  interface FAQCategory {
    title: string;
    questions: { id: number; title: string; answer: string; open: boolean }[];
  }
  
  const faqCategories = ref<FAQCategory[]>([
    {
      title: "Général",
      questions: [
        {
          id: 1,
          title: "Qu'est-ce que PhoneArena?",
          answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultricies aliquet vestibulum. Aliquam bibendum tellus ipsum, eget aliquet ligula semper a. Suspendisse sit amet elementum sapien. ",
          open: false,
        },
      ],
    },
    {
      title: "Installation",
      questions: [
        {
          id: 2,
          title: "Comment installer PhoneArena?",
          answer: "Curabitur eget aliquam ante, eget hendrerit ex. Nulla convallis non nisi non tempus.",
          open: false,
        },
      ],
    },
    {
      title: "Fontionnement",
      questions: [
        {
          id: 3,
          title: "Comment contacter le service client ?",
          answer: "Vous pouvez installer Ionic Vue en utilisant la commande npm install -g @ionic/vue.",
          open: false,
        },
      ],
    },
    {
      title: "Processus d'achat",
      questions: [
        {
          id: 4,
          title: "Comment faire un achat?",
          answer: "Maecenas blandit, neque vel semper fermentum, magna neque maximus lorem, eget.",
          open: false,
        },
      ],
    },
  ]);
  
  const toggleAnswer = (questionId: any) => {
    faqCategories.value.forEach((category) => {
      const question = category.questions.find((q) => q.id === questionId);
      if (question) {
        question.open = !question.open;
      }
    });
  };
  
  </script>
  
  <style scoped>
  .answer {
    background-color: #f5f5f5;
    padding: 10px;
  }

  .titleDropown ion-item-divider.ios.item{
    --background: #40bfff;
    color: #fff;
  }

    ion-back-button {
    --color: #40bfff;
  }

  ion-item-divider {
  --background: #40bfff;
  color: #fff;
}
  </style>
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
//import { supabase } from '@supabase/supabase-js';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/LoginPage",
  },
  {
    path: "/LoginPage",
    name: "LoginPage",
    component: () => import("../views/Login/LoginPage.vue"),
  },
  {
    path: "/RegisterPage",
    name: "RegisterPage",
    component: () => import("../views//Login/RegisterPage.vue"),
  },
  {
    path: "/ResetPassword",
    name: "ResetPassword",
    component: () => import("../views//Login/ResetPassword.vue"),
  },
  {
    path: "/ForgotPassword",
    name: "ForgotPassword",
    component: () => import("../views/Login/ForgotPassword.vue"),
  },
  {
    path: "/HomePage",
    name: "HomePage",
    component: () => import("../views//Home/HomePage.vue"),
  },
  {
    path: "/MessagePage",
    name: "MessagePage",
    component: () => import("../views/Messagerie/MessagePage.vue"),
  },
  {
    path: "/AnnoncePage",
    name: "AnnoncePage",
    component: () => import("../views/Annonce/AnnoncePage.vue"),
  },
  {
    path: "/ComptePage",
    name: "ComptePage",
    component: () => import("../views/Compte/ComptePage.vue"),
  },
  {
    path: "/DetailDuProfil",
    name: "DetailDuProfil",
    component: () => import("../views/Compte/DetailDuProfil.vue"),
  },
  {
    path: "/Commande",
    name: "Commande",
    component: () => import("../views/Compte/Commande.vue"),
  },
  {
    path: "/DetailsDeCommande/:id",
    name: "DetailsDeCommande",
    component: () => import("../views/Compte/DetailsDeCommande.vue"),
  },
  {
    path: "/ModalAddress",
    name: "ModalAddress",
    component: () =>
      import("../views/Compte/DetailDuProfilModal/ModalAddress.vue"),
  },
  {
    path: "/GeolocalisationPage",
    name: "GeolocalisationPage",
    component: () => import("../views/Geolocation/GeolocationPage.vue"),
  },
  {
    path: "/PanierPage",
    name: "PanierPage",
    component: () => import("../views/Panier/PanierPage.vue"),
  },
  {
    path: "/FilterPage",
    name: "FilterPage",
    component: () => import("../views/Home/FilterPage.vue"),
  },
  {
    path: "/DetailPage/:id",
    name: "DetailPage",
    component: () => import("../views/Home/DetailPage.vue"),
  },
  {
    path: "/DetailPage/:id",
    name: "DetailPage",
    component: () => import("../views/Home/DetailPage.vue"),
  },
  {
    path: "/success",
    name: "SuccessPage",
    component: () => import("../views/Panier/SuccessPage.vue"),
  },
  {
    path: "/CreerAnnonce",
    name: "CreerAnnonce",
    component: () => import("../views/Annonce/CreerAnnonce.vue"),
  },
  {
    path: "/AnnonceDetail/:id",
    name: "AnnonceDetail",
    component: () => import("../views/Annonce/AnnonceDetail.vue"),
  },
  {
    path: "/cancel",
    name: "CancelPage",
    component: () => import("../views/Panier/CancelPage.vue"),
  },
  {
    path: "/Faq",
    name: "Faq",
    component: () => import("../views/Compte/Faq.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});


//getUser
// async function getUser(next) {
//   const localUser = await supabase.auth.getSession();
//   if (localUser.data.session == null ) {
//     next("/unauthorized");
//   }
// }

//auth requirements
// router.beforeEach((to,from,next) => {
//   if(to.meta.requiresAuth) {
//     getUser(next);
//     // console.log("requires Auth")
//   }
//   else {
//     next();
//   }
// })

export default router;

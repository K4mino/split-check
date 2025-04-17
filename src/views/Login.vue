<script setup lang="ts">
import { signInWithGoogle, signOut } from '@/utils/auth'
import { logoGoogle } from 'ionicons/icons'

import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    toastController,
    loadingController,
} from '@ionic/vue'

</script>

<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Login</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-button class="login-btn" color="dark" expand="block" @click="signInWithGoogle">
                Sign in with
                <ion-icon size="small" class="logo-google" :icon="logoGoogle"></ion-icon>
            </ion-button>
        </ion-content>
    </ion-page>
</template>

<style scoped>
.list-item-spacing {
    margin-bottom: 20px;
}

.logo-google {
    margin-left: 5px;
}

.login-page {
    max-width: 600px;
    margin: auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
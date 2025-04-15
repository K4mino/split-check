<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { useRouter } from 'vue-router';
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

const router = useRouter();


/* onMounted(async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session?.user) {
        router.replace('/home');
        return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            router.replace('/home');
        } else if (event === 'SIGNED_OUT') {
            if (router.currentRoute.value.path !== '/login') {
                router.replace('/login');
            }
        }
    });

    if (Capacitor.isNativePlatform()) {
        CapacitorApp.addListener('appUrlOpen', async(data: { url: string }) => {
            const slug = data.url.split('#')[1];
            if (slug && slug.startsWith('/auth/callback')) {
                const url = data.url;

                // The hash fragment contains the access token, refresh token, etc.
                const hashFragment = url.split('#')[1];

                if (hashFragment) {
                    // Convert the hash fragment to a URL-like string to parse it
                    const params = new URLSearchParams(hashFragment);

                    // Get the tokens
                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');

                    if (accessToken && refreshToken) {
                        // Set the session with the tokens
                        const { error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken
                        });

                        if (error) {
                            console.error('Error setting session:', error);
                        } else {
                            // Navigate to home on successful auth
                            router.replace('/home');
                        }
                    }
                }
            }
        });
    }

    return () => {
        subscription?.unsubscribe();
    };
}); */

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
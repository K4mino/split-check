<template>
    <router-link :to="props.to ?? '/'">
        <ion-card>
            <ion-card-header>

                <ion-row class="ion-justify-content-start ion-align-items-center">
                    <ion-col class="ion-align-items-center" size="3">
                        <ion-icon size="large" :icon="props.icon"></ion-icon>
                    </ion-col>
                    <ion-col size="6">
                        <div class="ion-text-start">
                            <ion-card-title class="io">{{ props.title }}</ion-card-title>
                            <ion-card-subtitle>{{ props.subTitle }}</ion-card-subtitle>
                        </div>
                    </ion-col>
                </ion-row>
            </ion-card-header>
        </ion-card>
    </router-link>
</template>
<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonRow, IonCol } from '@ionic/vue';
import { peopleOutline } from 'ionicons/icons';
import { RouterLink } from 'vue-router'

const props = defineProps({
    title: String,
    subTitle: String,
    icon: String,
    to:String 
}) 

</script>
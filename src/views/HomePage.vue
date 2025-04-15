<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Quick Expense Splitter</ion-title>
        <ion-button color="dark" size="small" class="auth-btn" v-if="!session">
          Sign in
          <ion-icon slot="icon-only" :icon="logInOutline"></ion-icon>
        </ion-button>
        <ion-button color="dark" size="small" class="auth-btn" @click="signOut" v-else>
          Sign out
          <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <GroupCard to="/groups" :icon="peopleOutline" title="My groups" subTitle="Manage your expense groups" />
        <GroupCard :icon="receiptOutline" title="Recent Expenses" subTitle="View and manage expenses" />
        <GroupCard :icon="timeOutline" title="History" subTitle="View past transactions" />
        <GroupCard :icon="shareSocialOutline" title="Export & Share" subTitle="Share expense reports" />
      </div>
      <router-link to="/addExpenses">
        <ion-button  size="large" class="add-expense-btn" color="dark" shape="round">
          <ion-icon slot="icon-only" :icon="addCircle"></ion-icon>
        </ion-button>
      </router-link>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonButton, IonIcon, IonRow, IonCol } from '@ionic/vue';
import { peopleOutline, receiptOutline, timeOutline, shareSocialOutline, addCircle, logOutOutline, logInOutline } from 'ionicons/icons';
import GroupCard from '@/components/GroupCard.vue'
import { supabase } from '../supabase'
import { onMounted, ref } from 'vue'
import { signOut } from '@/utils/auth'
import { RouterLink} from 'vue-router'
const session = ref()

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  session.value = data.session

  supabase.auth.onAuthStateChange((_, newSession) => {
    session.value = newSession
  })
})

</script>

<style scoped>
#container {
  text-align: center;
  display: flex;
  flex-direction: column;
  position: relative;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

.add-expense-btn {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.auth-btn {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 14px;
  text-transform: none;
  width: 100px;
}
</style>

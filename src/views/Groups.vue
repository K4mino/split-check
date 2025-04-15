<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardSubtitle,
    IonCardHeader,
    IonCardTitle,
    IonBadge,
    IonButtons,
    IonBackButton,
    IonRow,
    IonAvatar,
    IonText,
    IonLabel,
    IonLoading
} from '@ionic/vue'
import { addCircleOutline, chevronForwardOutline } from 'ionicons/icons'
import { supabase } from '../supabase'
import type { Group } from '@/shared/types'

const router = useRouter()

const groups = ref<Group[]>([])
const isLoading = ref(false)

onMounted(async () => {
    try {
        isLoading.value = true
        const user = (await supabase.auth.getUser()).data.user
        const { data: fetchedGroups, error } = await supabase
            .from('groups')
            .select('*')
            .eq('created_by', user?.id)

        const enrichedGroups: Group[] = []

        if (fetchedGroups) {
            for (const group of fetchedGroups) {
                const { data: groupMembers } = await supabase
                    .from('group_members')
                    .select('name')
                    .eq('group_id', group.id)

                const { data: latestExpense } = await supabase
                    .from('expenses')
                    .select('*')
                    .eq('group_id', group.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                const { data: expenses } = await supabase
                    .from('expenses')
                    .select('*')
                    .eq('group_id', group.id)

                const pending = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0
                const pendingAmount = `$${pending.toFixed(2)}`

                enrichedGroups.push({
                    ...group,
                    members: groupMembers?.map((m) => m.name) || [],
                    recentExpense: latestExpense?.title || '—',
                    date: latestExpense?.created_at
                        ? new Date(latestExpense.created_at).toLocaleDateString()
                        : '',
                    pendingAmount,
                })
            }
        }

        groups.value = enrichedGroups
        isLoading.value = false
        if (error) throw new Error(error.message);
    } catch (error) {
        console.log(error)
    }
})

</script>

<template>
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/home" />
                </ion-buttons>
                <IonTitle>My Groups</IonTitle>
                <IonButton color="dark" slot="end" size="small" @click="router.push('/create-group')">
                    <IonIcon :icon="addCircleOutline" slot="start" />
                    New Group
                </IonButton>
            </IonToolbar>
        </IonHeader>

        <IonContent class="ion-padding">
            <ion-text color="medium">
                <h3>Manage your expense groups</h3>
            </ion-text>

            <IonLoading :is-open="isLoading" message="Loading..."  spinner="crescent"> </IonLoading>
            <div>
                <IonCard class="groups-card" v-for="group in groups" :key="group.id" @click="router.push(`/groups/${group.id}`)">
                    <IonCardHeader>
                        <IonRow class="ion-justify-content-between">
                            <IonCardTitle>{{ group.name }}</IonCardTitle>
                            <IonBadge color="medium">{{ group.pendingAmount }}</IonBadge>
                        </IonRow>
                    </IonCardHeader>
                    <IonCardContent>
                        <ion-row class="ion-justify-content-start">
                            <IonAvatar v-for="(member, i) in group.members.slice(0, 3)" :key="i"
                                style="width: 32px; height: 32px; border: 2px solid var(--ion-color-light); background: var(--ion-color-step-150); display: flex; align-items: center; justify-content: center; font-size: 12px;">
                                <IonLabel>{{ member.charAt(0) }}</IonLabel>
                            </IonAvatar>
                            <IonAvatar v-if="group.members.length > 3"
                                style="width: 32px; height: 32px; border: 2px solid var(--ion-color-light); background: var(--ion-color-step-150); display: flex; align-items: center; justify-content: center; font-size: 12px;">
                                <IonLabel>+{{ group.members.length - 3 }}</IonLabel>
                            </IonAvatar>
                        </ion-row>
                        <IonCardSubtitle>
                            Last expense: {{ group.recentExpense }}<br />
                            {{ group.date }}
                        </IonCardSubtitle>
                        <div style="display: flex; justify-content: flex-end; margin-top: 8px">
                            <IonIcon :icon="chevronForwardOutline" />
                        </div>
                    </IonCardContent>
                </IonCard>
            </div>

           <!--  <div v-if="groups.length === 0" style="text-align: center; padding: 2rem">
                <ion-text color="medium">
                    <p>You don't have any groups yet</p>
                </ion-text>
                <IonButton @click="router.push('/create-group')">Create Your First Group</IonButton>
            </div> -->
        </IonContent>
    </IonPage>
</template>

<style scoped>
.groups-card{
    margin: 10px 0  ;
}
</style>

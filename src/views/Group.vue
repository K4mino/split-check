<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/home" />
                </ion-buttons>
                <ion-title>{{ group?.name }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <IonContent class="ion-padding">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h2 class="text-xl font-bold">{{ group?.name }}</h2>
                    <p class="text-gray-500">{{ groupMembers?.length }} members</p>
                </div>
                <IonButton color="dark" size="small" @click="router.push(`/addexpenses?group=${group?.id}`)">
                    <IonIcon :icon="addCircleOutline" slot="start" />
                    Add Expense
                </IonButton>
            </div>

            <!-- <IonSegment v-model="selectedTab">
                <IonSegmentButton value="balances">
                    <IonLabel>Balances</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="expenses">
                    <IonLabel>Expenses</IonLabel>
                </IonSegmentButton>
            </IonSegment> -->

            <div>
                <!-- <IonCard>
                    <IonCardContent>
                        <h3 class="font-medium mb-3">Summary</h3>
                        <div class="space-y-3">
                            <div v-for="member in group.members" :key="member.id" class="flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                        {{ member.name.charAt(0) }}
                                    </div>
                                    <span>{{ member.name }}</span>
                                </div>
                                <span :class="{
                                    'bg-green-100 text-green-800 px-2 py-1 rounded': member.balance > 0,
                                    'bg-red-100 text-red-800 px-2 py-1 rounded': member.balance < 0,
                                    'bg-gray-200 text-gray-600 px-2 py-1 rounded': member.balance === 0,
                                }">
                                    {{ member.balance > 0 ? `gets $${member.balance.toFixed(2)}` : member.balance < 0 ?
                                        `owes $${Math.abs(member.balance).toFixed(2)}` : 'settled up' }} </span>
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardContent>
                        <h3 class="font-medium mb-3">Settle Up</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between" v-for="(debtor, index) in group.members.slice(1)"
                                :key="debtor.id">
                                <div class="flex items-center gap-2">
                                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                        {{ debtor.name.charAt(0) }}
                                    </div>
                                    <span>{{ debtor.name }}</span>
                                </div>
                                <IonIcon :icon="arrowForwardOutline" />
                                <div class="flex items-center gap-2">
                                    <span>You</span>
                                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                        Y
                                    </div>
                                </div>
                                <IonButton size="small" fill="outline">
                                    ${{ Math.abs(debtor.balance).toFixed(2) }}
                                </IonButton>
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard> -->
            </div>

            <div>
                <IonCard class="ion-card " v-for="expense in expenses" :key="expense.id"
                    @click="router.push(`/expenses/${expense.id}`)">
                    <IonCardContent>
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-col>
                                <ion-text>
                                    <h3 class="expense-title">{{ expense.title }}</h3>
                                </ion-text>

                                <ion-text color="medium">
                                    <p>{{ formatDate(expense.created_at) }}</p>
                                </ion-text>

                            </ion-col>
                            <ion-col>
                                <p>${{ expense.amount.toFixed(2) }}</p>
                                <p>Paid by {{ expense.paid_by == user.id ? 'You' : getMember(expense.paid_by)?.name }}</p>
                            </ion-col>
                        </ion-row>
                    </IonCardContent>
                </IonCard>
            </div>

            <IonRow class="ion-justify-content-between ion-align-items-center">
                <IonCol>
                    <IonButton color="dark" fill="outline" @click="router.push(`/share?group=${group?.id}`)">
                        Export Summary
                    </IonButton>
                </IonCol>
                <IonCol>
                    <IonButton color="dark"  @click="deleteGroup">
                        Delete Group
                    </IonButton>
                </IonCol>
            </IonRow>
        </IonContent>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonCardContent,
    IonIcon,
    IonRow,
    IonCol,
    IonText
} from '@ionic/vue'
import { arrowForwardOutline, chevronBackOutline, addCircleOutline } from 'ionicons/icons'
import { supabase } from '@/supabase';
import { formatDate } from '@/utils/date'
import type { Group, Expense, GroupMember } from '@/shared/types'

const router = useRouter()
const route = useRoute()

const group = ref<Group | null>(null)
const expenses = ref<Expense[] | null>([])
const user = ref()
const groupMembers = ref<GroupMember[] | null>([])

const getMember = (id: string) => {
    return groupMembers.value?.find((member: GroupMember) => member.id === id)
}

const deleteGroup = async() => {
    try {
        const {data,error} = await supabase
        .from('groups')
        .delete()
        .eq('id',group.value?.id)

        router.push('/groups') 
        if(error) throw new Error(error.message)
    } catch (error) {
        console.log(error)
    }
}

onMounted(async () => {
    try {
        user.value = (await supabase.auth.getUser()).data.user

        const { data: fetchedGroup, error } = await supabase
            .from('groups')
            .select('*')
            .eq('id', route.params.id)
            .single()

        if (fetchedGroup) {
            group.value = fetchedGroup
        }

        const { data: fetchedExpenses } = await supabase
            .from('expenses')
            .select('*')
            .eq('group_id', fetchedGroup.id)

        if (fetchedExpenses) {
            expenses.value = fetchedExpenses
        }

        const { data: fetchedGroupMembers } = await supabase
            .from('group_members')
            .select('*')
            .eq('group_id', fetchedGroup.id)

        groupMembers.value = fetchedGroupMembers

        if (error) throw new Error(error.message)
    } catch (error) {
        console.log(error)
    }
})

const selectedTab = ref('balances')
</script>

<style scoped>
.ion-card {
    margin: 10px 0 !important;
}

.expense-title {
    font-size: 18px;
    font-weight: 600;
}
</style>
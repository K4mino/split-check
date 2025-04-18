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

            <IonSegment color="dark" v-model="selectedTab">
                <IonSegmentButton value="balances">
                    <IonLabel>Balances</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="expenses">
                    <IonLabel>Expenses</IonLabel>
                </IonSegmentButton>
            </IonSegment>

            <div v-if="selectedTab === 'balances'">
                <IonCard class="ion-card">
                    <IonCardContent>
                        <h3>Summary</h3>
                        <div>
                            <IonRow class="ion-justify-content-between" v-for="member in groupMembers" :key="member.id">
                                <IonCol size="4">
                                    <IonRow class="ion-justify-content-start ion-align-items-center">
                                        <IonCol>
                                            <IonAvatar class="avatar-circle">
                                                <IonLabel> {{ member.name.charAt(0) }}</IonLabel>
                                            </IonAvatar>
                                        </IonCol>
                                        <IonCol>
                                            <span>{{ member.name }}</span>
                                        </IonCol>
                                    </IonRow>
                                </IonCol>
                                <IonCol size="4">
                                    <IonBadge :color="balances[member.id] > 0
                                        ? 'dark'
                                        : balances[member.id] < 0
                                            ? 'medium'
                                            : 'medium'" class="ion-text-wrap">
                                        {{
                                            balances[member.id] > 0
                                            ? `gets $${balances[member.id].toFixed(2)}`
                                            : balances[member.id] < 0 ? `owes $${Math.abs(balances[member.id]).toFixed(2)}`
                                                : 'settled up' }} </IonBadge>
                                </IonCol>
                            </IonRow>
                        </div>
                    </IonCardContent>
                </IonCard>

                <IonCard class="ion-card">
                    <IonCardContent>
                        <h3 class="settle-title">Settle Up</h3>

                        <div class="settle-list">
                            <div class="settle-row" v-for="(debtor, index) in groupMembers?.slice(1)" :key="debtor.id">
                                <div class="member-side">
                                    <div class="avatar-circle">
                                        {{ debtor.name.charAt(0) }}
                                    </div>
                                    <span>{{ debtor.name }}</span>
                                </div>

                                <IonIcon :icon="arrowForwardOutline" />

                                <div class="member-side">
                                    <span>You</span>
                                    <div class="avatar-circle">Y</div>
                                </div>

                                <IonButton size="small" fill="outline" color="dark">
                                    ${{ Math.abs(balances[debtor.id]) }}
                                </IonButton>
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard>
            </div>

            <div v-else>
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
                    <IonButton color="dark" @click="deleteGroup">
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
    IonText,
    IonAvatar,
    IonBadge
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
const balances: Record<string, number> = {}

const getMember = (id: string) => {
    return groupMembers.value?.find((member: GroupMember) => member.id === id)
}

const deleteGroup = async () => {
    try {
        const { data, error } = await supabase
            .from('groups')
            .delete()
            .eq('id', group.value?.id)

        router.push('/groups')
        if (error) throw new Error(error.message)
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
            .select(`
                id,
                amount,
                paid_by,
                created_at,
                group_id,
                title,
                split_type,
                expense_splits (
                    member_id,
                    amount
                )
            `)
            .eq('group_id', fetchedGroup.id)

        if (fetchedExpenses) {
            expenses.value = fetchedExpenses
        }

        const { data: fetchedGroupMembers } = await supabase
            .from('group_members')
            .select('*')
            .eq('group_id', fetchedGroup.id)

        groupMembers.value = fetchedGroupMembers

        groupMembers.value.forEach((m) => {
            balances[m.id] = 0
        })

        expenses.value.forEach((expense) => {
            balances[expense.paid_by] += expense.amount

            expense.expense_splits?.forEach((split) => {
                balances[split.member_id] -= split.amount
            })
        })
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

.settle-title {
    font-weight: 500;
    margin-bottom: 12px;
}

.settle-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.settle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
}

.member-side {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>
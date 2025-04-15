<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/home" />
                </ion-buttons>
                <ion-title>Back</ion-title>
            </ion-toolbar>
        </ion-header>
        <IonContent class="ion-padding">
            <div class="expense-header">
                <div>
                    <h1 class="expense-title">{{ expense?.title }}</h1>
                    <div class="expense-date">
                        <IonIcon :icon="calendarOutline" class="icon-inline" />
                        <span>{{ formatDate(expense?.created_at) }}</span>
                    </div>
                </div>
                <IonButton fill="outline" size="small" @click="router.push(`/expenses/${expense?.id}/edit`)">
                    <IonIcon :icon="createOutline" slot="start" />
                    Edit
                </IonButton>
            </div>

            <IonCard class="expense-card">
                <IonCardContent>
                    <div class="expense-summary">
                        <div>
                            <p class="label-muted">Total Amount</p>
                            <p class="amount-large">${{ expense?.amount.toFixed(2) }}</p>
                        </div>
                        <div>
                            <p class="label-muted">Paid by</p>
                            <div class="payer-info">
                                <IonAvatar class="avatar-small">
                                    <IonLabel class="avatar-text">Y</IonLabel>
                                </IonAvatar>
                                <p class="payer-name">{{ expense?.paid_by == user?.id ? 'You' :
                                    getMember(expense!!.paid_by)?.name }}</p>
                            </div>
                        </div>
                    </div>

                    <hr class="divider" />

                    <div class="split-info">
                        <p class="split-heading">Split Details ({{ expense?.split_type }})</p>
                        <p class="label-muted-small">How much each person pays</p>
                    </div>

                    <div class="member-list">
                        <div v-for="member in expense?.expense_splits" :key="member.id" class="member-item">
                            <div class="member-info">
                                <IonAvatar class="avatar-medium">
                                    <IonLabel class="avatar-text">{{ member.group_members.name.charAt(0) }}</IonLabel>
                                </IonAvatar>
                                <span>{{ member.group_members.name }}</span>
                            </div>
                            <span class="member-amount">${{ member.amount.toFixed(2) }}</span>
                        </div>
                    </div>
                </IonCardContent>
            </IonCard>

            <IonCard v-if="expense?.receipt" class="expense-card">
                <IonCardContent>
                    <div class="receipt-header">
                        <div class="receipt-title">
                            <IonIcon :icon="documentTextOutline" />
                            <h3>Receipt</h3>
                        </div>
                        <IonButton fill="clear" size="small">View Full</IonButton>
                    </div>

                    <div class="receipt-image">
                        <img src="" alt="Receipt" width="400" height="300" />
                    </div>
                </IonCardContent>
            </IonCard>

            <div class="action-buttons">
                <IonButton fill="outline">Delete</IonButton>
                <IonButton>Mark as Settled</IonButton>
            </div>
        </IonContent>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
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
    IonAvatar
} from '@ionic/vue'
import { calendarOutline, documentTextOutline, chevronBackOutline, createOutline } from 'ionicons/icons'
import { supabase } from '@/supabase';
import type { Expense, GroupMember } from '@/shared/types'
import { formatDate } from '@/utils/date'

const expense = ref()
const route = useRoute()
const router = useRouter()
const user = ref()

onMounted(async () => {
    try {
        console.log(route)
        user.value = (await supabase.auth.getUser()).data.user

        const { data: fetchedExpense, error } = await supabase
            .from('expenses')
            .select(`
                    id,
                    title,
                    amount,
                    paid_by,
                    split_type,
                    expense_splits (
                    id,
                    amount,
                    member_id,
                    group_members (
                        id,
                        name,
                        email
                        )
                    )
                    `)
            .eq('id', route.params.id)
            .single()

            console.log(fetchedExpense, error)
        expense.value = fetchedExpense
    } catch (error) {
        console.log(error)
    }
})

const getMember = (id: string) => {
    return expense.value?.expense_splits.find((member) => member.member_id === id)
}

</script>

<style scoped>
.expense-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.expense-title {
    font-size: 24px;
    font-weight: bold;
}

.expense-date {
    display: flex;
    align-items: center;
    color: var(--ion-color-medium);
}

.icon-inline {
    margin-right: 4px;
}

.expense-card {
    margin: 0 0 20px;
}

.expense-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.label-muted {
    font-size: 14px;
    color: var(--ion-color-medium);
}

.label-muted-small {
    font-size: 12px;
    color: var(--ion-color-medium);
}

.amount-large {
    font-size: 24px;
    font-weight: bold;
}

.payer-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.avatar-small {
    width: 24px;
    height: 24px;
}

.avatar-medium {
    width: 32px;
    height: 32px;

}

.avatar-text {
    font-size: 12px;
}

.payer-name {
    font-weight: 500;
}

.divider {
    margin: 16px 0;
    border: none;
    border-top: 1px solid ;
}

.split-info {
    margin-bottom: 16px;
}

.split-heading {
    font-weight: 500;
}

.member-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.member-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.member-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.member-amount {
    font-weight: 500;
}

.receipt-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.receipt-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.receipt-image {
    border: 1px solid var(--ion-color-step-150);
    border-radius: 8px;
    overflow: hidden;
}

.receipt-image img {
    width: 100%;
    object-fit: cover;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
}
</style>

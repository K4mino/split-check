<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonBadge,
    IonAvatar,
    IonLabel,
} from '@ionic/vue'
import { chevronBackOutline, filterOutline, addCircleOutline, receiptOutline,cashOutline } from 'ionicons/icons'
import { supabase } from '@/supabase';

const router = useRouter()
const user = ref()
const expenses = ref([])

onMounted(async () => {
    try {
        user.value = (await supabase.auth.getUser()).data.user

        const { data:fetchedExpenses, error } = await supabase
            .from('expenses')
            .select(`
                id,
                title,
                amount,
                created_at,
                paidBy:group_members (
                    id,
                    name
                    ),
                group:groups (
                    id,
                    name
                    )
                `)
        
                console.log(fetchedExpenses, error)

        expenses.value = fetchedExpenses

    } catch (error) {
        console.log(error)
    }
})

</script>

<template>
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButton color="dark" fill="clear" slot="start" @click="router.replace('/')">
                    <IonIcon :icon="chevronBackOutline" slot="start" />
                    Back to Home
                </IonButton>
            </IonToolbar>
        </IonHeader>

        <IonContent class="ion-padding">
            <div class="header-info">
                <h2>Recent Expenses</h2>
                <p class="subtitle">View all expenses across groups</p>
                <div class="action-buttons">
                    <IonButton fill="outline" size="small">
                        <IonIcon :icon="filterOutline" />
                    </IonButton>
                    <IonButton size="small" @click="router.push('/add-expense')">
                        <IonIcon :icon="addCircleOutline" slot="start" />
                        Add
                    </IonButton>
                </div>
            </div>

            <div class="expense-list">
                <IonCard v-for="expense in expenses" :key="expense.id" @click="router.push(`/expenses/${expense.id}`)">
                    <IonCardContent>
                        <div class="expense-group">
                            <IonBadge color="dark">{{ expense.group.name }}</IonBadge>
                            <span class="expense-amount">${{ expense.amount.toFixed(2) }}</span>
                        </div>

                        <div class="expense-title">
                            <div class="icon-container">
                                <IonIcon :icon="receiptOutline" class="receipt-icon" />
                            </div>
                            <div>
                                <h3 class="expense-name">{{ expense.title }}</h3>
                                <p class="expense-date">{{ expense.date }}</p>
                            </div>
                        </div>

                        <div class="expense-paid">
                            <span>Paid by:</span>
                            <div class="paid-info">
                                <IonAvatar class="paid-avatar">
                                    <IonLabel class="avatar-initial">{{ expense.paidBy.name.charAt(0) }}</IonLabel>
                                </IonAvatar>
                                <span>{{ expense.paidBy.name }}</span>
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard>
            </div>

            <div v-if="expenses?.length === 0" class="empty-state">
                <p>No expenses recorded yet</p>
                <IonButton @click="router.push('/add-expense')">Add Your First Expense</IonButton>
            </div>
        </IonContent>
    </IonPage>
</template>

<style scoped>
.header-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.subtitle {
    color: var(--ion-color-medium);
    font-size: 14px;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.expense-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.expense-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.expense-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.icon-container {
    background: var(--ion-color-dark);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.receipt-icon {
    font-size: 18px;
    color: var(--ion-color-primary-contrast);
}

.expense-name {
    font-weight: 500;
    margin: 0;
}

.expense-date {
    font-size: 12px;
    color: var(--ion-color-medium);
}

.expense-paid {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ion-color-medium);
}

.paid-info {
    display: flex;
    align-items: center;
    gap: 6px;
}

.paid-avatar {
    width: 20px;
    height: 20px;
    font-size: 10px;
    background: var(--ion-color-step-150);
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-initial {
    font-size: 10px;
    color: var(--ion-color-dark);
}

.expense-amount {
    font-weight: 600;
}

.empty-state {
    text-align: center;
    padding: 32px 0;
    color: var(--ion-color-medium);
}</style>

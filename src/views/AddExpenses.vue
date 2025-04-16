<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/home" />
                </ion-buttons>
                <ion-title>Add Expenses</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-card>
                <div class="add-expenses-body">
                    <ion-label>Expense Title</ion-label>
                    <ion-input v-model="expenseTitle" fill="outline"
                        placeholder="e.g., Dinner, Groceries, Rent"></ion-input>

                    <ion-label>Amount</ion-label>
                    <ion-input v-model="amount" fill="outline" placeholder="0.00"></ion-input>

                    <ion-label>Groups</ion-label>
                    <ion-select placeholder="Select group" v-model="selectedGroupId"  fill="outline">
                        <ion-select-option v-for="group in groups" :value="group.id">{{ group.name }}</ion-select-option>
                    </ion-select>

                    <ion-label>Paid by</ion-label>
                    <ion-select placeholder="Select who paid" v-model="paidBy" fill="outline">
                        <ion-select-option v-for="member in selectedGroupMembers" :value="member.id">{{ member.name }}</ion-select-option>
                    </ion-select>

                    <div>
                        <ion-label>Split Type</ion-label>

                        <ion-segment color="dark" v-model="splitType">
                            <ion-segment-button value="equal">
                                <ion-label>Equal Split</ion-label>
                            </ion-segment-button>
                            <ion-segment-button value="custom">
                                <ion-label>Custom Split</ion-label>
                            </ion-segment-button>
                        </ion-segment>

                        <div v-if="splitType === 'equal'" >
                            <p class="text-sm text-muted">The expense will be split equally among all members.</p>
                        </div>

                        <div v-else>
                            <ion-row v-for="member in selectedGroupMembers" :key="member.id"
                                class="ion-justify-content-start ion-align-items-center">
                                <ion-col size="4">
                                    <span>{{ member.name }}</span>
                                </ion-col>
                                <ion-col size="8">
                                    <ion-input v-model="member.amount" fill="outline" placeholder="0.00" type="number" inputmode="decimal" class="text-end">
                                        <template #prefix>$</template>
                                    </ion-input>
                                </ion-col>
                            </ion-row>
                        </div>
                    </div>

                    <div>
                        <ion-label>Receipt (Optional)</ion-label>

                        <div>
                            <ion-button color="dark" expand="block" fill="outline">
                                <ion-icon :icon="camera" />
                                <span class="text-xs">Take Photo</span>
                            </ion-button>

                            <ion-button color="dark" expand="block" fill="outline">
                                <ion-icon :icon="documentTextOutline" />
                                <span>Upload Receipt</span>
                            </ion-button>
                        </div>
                    </div>

                    <ion-row class="ion-justify-content-end">
                        <ion-button color="dark" fill="outline">
                            Cancel
                        </ion-button>
                        <ion-button @click="createExpense" color="dark">
                            Save
                        </ion-button>
                    </ion-row>
                </div>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
    IonToolbar,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonCard,
    IonCardTitle,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonBackButton,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonRow,
    IonCol,
    IonIcon
} from '@ionic/vue';
import { camera, documentTextOutline } from 'ionicons/icons'
import { supabase } from '../supabase'

const splitType = ref<'equal' | 'custom'>('equal')
const amount = ref()
const selectedGroupId = ref()
const selectedGroupMembers = ref()
const expenseTitle = ref()
const paidBy = ref()
const groups = ref()

const router = useRouter()
const route = useRoute()

onMounted(async () => {
    try {
        const user = (await supabase.auth.getUser()).data.user
        const { data: fetchedGroups, error } = await supabase
            .from('groups')
            .select('*')
            .eq('created_by', user?.id)

        groups.value = fetchedGroups

        if(route.query.group){
            selectedGroupId.value = route.query.group
        }

    } catch (error) {
        console.log(error)
    }
})

watch( () => selectedGroupId.value, async (newSelectedGroup) => {
    const {data: fetchedGroupMembers, error: fetchingGroupMembersError} = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', newSelectedGroup)

    selectedGroupMembers.value = fetchedGroupMembers
})

const createExpense = async () => {
    const user = (await supabase.auth.getUser()).data.user

    const { data: newExpense, error } = await supabase
        .from('expenses')
        .insert({
            title: expenseTitle.value,
            amount: amount.value,
            paid_by: paidBy.value,
            group_id: selectedGroupId.value,
            split_type: splitType.value
        })
        .select()
        .single()
       
    for(const member of selectedGroupMembers.value){
        let splitAmount = member.amount

        if(splitType.value === 'equal'){    
            splitAmount = newExpense.amount/selectedGroupMembers.value.length
        }

        await supabase.from('expense_splits').insert({
            expense_id:newExpense.id,
            member_id:member.id,
            amount:splitAmount
        })
    }

    if (error) {
        console.error('Error creating group:', error)
        return
    }

    router.push(`/home`)
}

</script>

<style scoped>
.add-expenses-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    font-weight: 600;
}
</style>
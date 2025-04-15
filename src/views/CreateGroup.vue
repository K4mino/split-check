<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonInput,
  IonLabel,
  IonButton,
  IonIcon,
  IonAvatar,
  IonText,
  IonRow
} from '@ionic/vue'
import { personAddOutline, chevronBackOutline, closeOutline } from 'ionicons/icons'
import { supabase } from '../supabase'

const router = useRouter()

const groupName = ref('')
const memberInput = ref('')
const members = ref<{ name: string; email?: string }[]>([])

const addMember = () => {
  if (!memberInput.value.trim()) return

  const emailMatch = memberInput.value.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)

  if (emailMatch) {
    const email = emailMatch[0]
    const name = memberInput.value.replace(email, '').trim() || email.split('@')[0]
    members.value.push({ name, email })
  } else {
    members.value.push({ name: memberInput.value })
  }

  memberInput.value = ''
}

const removeMember = (index: number) => {
  members.value.splice(index, 1)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    addMember()
  }
}

const createGroup = async () => {
  if (!groupName.value || members.value.length === 0) return

  const user = (await supabase.auth.getUser()).data.user

  const { data, error } = await supabase
    .from('groups')
    .insert({
      name: groupName.value,
      created_by: user?.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating group:', error)
    return
  }

  console.log('Group created:', data)

  await supabase.from('group_members').insert(
    members.value.map((member) => ({
      group_id: data.id,
      name: member.name,
      email: member.email ?? null,
    }))
  )

  router.push(`/groups/${data.id}`)
}

</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton color="dark" default-href="/groups" />
        </IonButtons>
        <IonTitle>Create Group</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Create a New Group</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <IonLabel>Group Name</IonLabel>
          <IonInput
            fill="outline"
            placeholder="e.g., Roommates, Trip to Paris"
            v-model="groupName"
            id="group-name"
            aria-label="Group Name"
          />

          <div style="margin-top: 16px">
            <IonLabel>Add Members</IonLabel>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <IonInput
                fill="outline"
                placeholder="Name or email"
                v-model="memberInput"
                id="add-member"
                @keydown="handleKeyDown"
              />
              <IonButton fill="outline" @click="addMember">
                <IonIcon :icon="personAddOutline" />
              </IonButton>
            </div>
            <IonText color="medium">
              <p style="font-size: 12px; margin-top: 4px">Press Enter to add multiple members</p>
            </IonText>
          </div>

          <div v-if="members.length > 0" style="margin-top: 24px">
            <IonLabel>Members</IonLabel>
            <div style="border: 1px solid var(--ion-color-step-150); border-radius: 8px; padding: 12px; margin-top: 8px;">
              <div
                v-for="(member, index) in members"
                :key="index"
                style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px"
              >
                <div style="display: flex; align-items: center; gap: 8px">
                  <IonAvatar style="width: 32px; height: 32px; background: var(--ion-color-light); display: flex; align-items: center; justify-content: center; font-size: 12px">
                    <IonLabel>{{ member.name.charAt(0).toUpperCase() }}</IonLabel>
                  </IonAvatar>
                  <div>
                    <p style="font-size: 14px; font-weight: 500">{{ member.name }}</p>
                    <p v-if="member.email" style="font-size: 12px; color: var(--ion-color-medium)">{{ member.email }}</p>
                  </div>
                </div>
                <IonButton size="small" fill="clear" @click="removeMember(index)">
                  <IonIcon :icon="closeOutline" />
                </IonButton>
              </div>
            </div>
          </div>
        </IonCardContent>

        <IonRow class="ion-justify-content-around">
          <IonButton fill="outline" @click="router.push('/groups')">Cancel</IonButton>
          <IonButton @click="createGroup" :disabled="!groupName || members.length === 0">Create Group</IonButton>
        </IonRow>
      </IonCard>
    </IonContent>
  </IonPage>
</template>

<style scoped>
</style>

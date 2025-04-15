// supabase.ts
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const user = ref()
export const session = ref()

export const initUser = async () => {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user || null
    
    supabase.auth.onAuthStateChange((_, newSession) => {
      session.value = newSession
      user.value = newSession?.user || null
    })
  }
import { supabase } from '../supabase'
import { Capacitor } from '@capacitor/core';


export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        window.location.href = '/login'
        if (error) throw error;
    } catch (error) {
        console.error('Error signing out:', error);
    }
};

export const signInWithGoogle = async () => {
    try {
        const isNative = Capacitor.isNativePlatform();
        const redirectUrl = isNative 
          ? import.meta.env.VITE_SUPABASE_OAUTH_CALLBACK_URL as string
          : `${window.location.origin}/login`;

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
            }
        });

        if (error) throw error;
    } catch (error) {
        console.error('Error signing in:', error);
    }
};
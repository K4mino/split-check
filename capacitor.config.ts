import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Split check',
  webDir: 'dist',
  server:{
    allowNavigation: ['https://qfehabwdazdoqoicrepz.supabase.co'],
    androidScheme:"https"
  },
  plugins: {
    "CapacitorHttp": {
      "enabled": true
    },
    "App": {
      "appUrlOpen": {
        "enabled": true
      }
    }
  },
};

export default config;

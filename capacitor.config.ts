import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.handyforme.app',
  appName: 'HandyForMe',
  webDir: 'out',
  server: {
    // Dynamic server URL from environment variable or fallback to the local ngrok/hosted URL
    url: process.env.CAPACITOR_SERVER_URL || 'https://www.handyfor.me',
    // url: process.env.CAPACITOR_SERVER_URL || 'https://ef80-189-1-168-15.ngrok-free.app',
    cleartext: true
  },
  android: {
    // Standard User Agent string that avoids containing "Capacitor" or "wv" to bypass Google Sign-In WebView restrictions
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
  },
  ios: {
    // Standard Safari iOS User Agent string to bypass Google Sign-In WebView restrictions
    overrideUserAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  },
  plugins: {
    GoogleSignIn: {
      scopes: ['profile', 'email'],
      serverClientId: '979910939497-ejct3qq5u7bmf81r8vilujjv1o8m5s64.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;

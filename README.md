# Statify Profile

A beautiful Spotify analytics dashboard built with React, TypeScript, and Tailwind CSS.

## 🚀 Deployment Guide

### 1. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect it's a Vite app and deploy it

### 2. Configure Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

```
VITE_SPOTIFY_CLIENT_ID=*************
VITE_SPOTIFY_CLIENT_SECRET==*************
VITE_SPOTIFY_REDIRECT_URI=https://your-actual-vercel-url.vercel.app/callback
```

**Important:** Replace `your-actual-vercel-url` with your real Vercel deployment URL.

### 3. Update Spotify App Settings

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Click "Edit Settings"
4. In "Redirect URIs", add: `https://your-actual-vercel-url.vercel.app/callback`
5. Save changes

### 4. Redeploy

After adding environment variables, trigger a new deployment in Vercel to apply the changes.

## 🔧 Local Development

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Fill in your Spotify credentials
4. Run `npm install`
5. Run `npm run dev`

## 📝 Notes

- The `vercel.json` file ensures proper routing for the SPA
- Environment variables must be prefixed with `VITE_` to be accessible in the client
- Make sure your Spotify app's redirect URI exactly matches your deployment URL

## 🎵 Features

- View your top artists and tracks
- Analyze your listening habits over different time periods
- See detailed audio features for tracks
- Real-time currently playing information
- Beautiful, responsive design with smooth animations
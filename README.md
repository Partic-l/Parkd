# Parkd

A peer-to-peer real-time parking handoff web app built with React, Supabase, and Leaflet.

## What it does

Parkd connects drivers looking for parking with people who are leaving their spots. When a user is ready to leave, they broadcast their location on a live map. Nearby drivers can see the spot, request it, and complete the handoff — all in real time.

## Core flow

1. **Parker** taps "I'm leaving" → their spot appears as a pin on the map for nearby drivers
2. **Driver** taps the pin → requests the spot
3. **Parker** receives a notification and accepts or declines
4. **Driver** receives confirmation and navigates to the spot
5. **Driver** confirms the handoff is complete
6. **Parker** is awarded points for giving away their space

## Tech stack

- **Frontend:** React (Vite), React Leaflet, React Router v7
- **Backend/Database:** Supabase (Auth, PostgreSQL, Realtime)
- **Real-time:** Supabase Realtime with Postgres Changes

## Features

- Live map with geolocation tracking and proximity circle
- Real-time spot broadcasting and driver notifications
- Full authentication (sign up, login, protected routes)
- Parker accept/decline flow with real-time UI updates
- Points reward system for completed handoffs
- User profile with car details and adjustable search radius
- Mobile-friendly design with frosted glass navbar

## Getting started

1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the dev server:
   ```
   npm run dev
   ```

## Database schema

- `profiles` — user data including points, radius, and car details
- `spots` — active parking spots broadcast by parkers
- `requests` — handoff requests made by drivers

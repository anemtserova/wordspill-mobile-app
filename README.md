# Wordspill

A mobile journaling app for people who love keeping their thoughts and memories close to them.

## About

Wordspill is a React Native mobile application built with Expo that allows users to capture and organize their thoughts, memories, and experiences. Users can create "spills" (journal entries) with rich media, organize them into custom collections, tag them for easy discovery, date them and add locations to their memories.

The app features user authentication, account management with deactivation/reactivation capabilities, and automated scheduled tasks for account deletion and email reminders via Firebase Cloud Functions.

**_For full list of technical details check [FUNCTIONALGUIDE.md](/FUNCTIONALGUIDE.md)_**
#### ***To download*** `.apk` ***file, please check RELEASES > Assets***

## Features

- **Rich Journal Entries**: Create spills with text, images, videos, and location data
- **Custom Collections**: Organize your spills into personalized collections with custom icons and colors
- **Tagging System**: Tag your entries and search by tags for easy discovery
- **Media Support**: Add photos and videos from your camera or media library
- **Location Tracking**: Attach locations to your memories
- **User Authentication**: Secure Firebase Authentication (Email/Password, Google Sign-In)
- **Account Management**: Deactivate and reactivate your account
- **Automated Account Deletion**: Scheduled cloud functions handle account cleanup after 14 days of deactivation
- **Email Reminders**: Receive deactivation reminders at 7 days and 1 day before permanent deletion
- **App Sharing**: Share the app via expo-sharing API

## Tech Stack

### Mobile App

- **Framework**: React Native (0.81.5) with Expo (~54.0)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack, Bottom Tabs)
- **State Management**: TanStack Query (React Query)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Media**: Expo Camera, Image Picker, Media Library, Video
- **Location**: Expo Location
- **Gestures**: React Native Gesture Handler & Reanimated

### Cloud Functions

- **Runtime**: Node.js with TypeScript
- **Platform**: Firebase Cloud Functions
- **Email Service**: Resend API
- **Scheduling**: Firebase Pub/Sub (scheduled functions)

## Setup

1. Clone the repo and install dependencies:

   ```bash
   pnpm install
   ```

2. Add your Firebase credentials to `firebaseConfig.ts`.

3. Run the app:

   ```bash
   npm start          # Expo dev server
   npm run ios        # iOS
   npm run android    # Android
   ```

For Cloud Functions setup, see [functions/README.md](functions/README.md).

# Project Overview

## Application Name: **_Wordspill_**

## Application Category / Topic: **_Productivity / Personal Journaling / Creativity_**

## 1. Main Purpose (2–4 sentences):

Wordspill is a mobile journaling application that helps users capture and organize their thoughts, memories, and daily experiences in one place.  
Users can create rich entries (“spills”) with text, images, videos, tags, dates, and optional location data, then group them into custom collections for easier browsing.  
The app solves the problem of scattered personal notes by providing a structured, searchable, and media-friendly memory system. It also supports long-term account lifecycle management with reminder emails and scheduled deletion for deactivated accounts.

## 2. User Access & Permissions

### **Guest (Not Authenticated) User**

A guest user cannot access personal data areas (entries, collections, profile settings) until authentication is complete. The guest flow is limited to onboarding and authentication-related screens.

#### **_Available screens or actions:_**

- Onboarding flow (if not completed yet)

\*NOTE: onboarding was intended to consist of several video screens introducing the user to app goals and purpose but later was decided to be simplified to a single screen with app logo and a **_Get Started_** button

- Login screen
- Sign up screen
- Reset/Forgot password screen
- App Info screen (public informational content)

### **Authenticated User**

A logged-in user gets full access to personal content management and account features. Navigation is organized through the main tab interface plus stack-based detail screens.

\*NOTE: For the purpose of this guide all the user-generated written content is referred to as **_entries_** however throughtout the app the term used for it is **_spill\(s)_**.

#### **_Main sections / tabs:_**

- Home
- Collections
- Info
- Profile

#### **_Detail screens:_**

- Selected Collection (collection-specific entries list)
- Entry Details
- Entries by Tag
- Add Entry
- Edit Entry
- Edit Profile
- Settings (account settings/deactivation)

#### **_Create / Edit / Delete actions:_**

- Create collection
- Edit collection
- Delete collection
- Create entry (“spill”)
- Edit entry
- Delete entry
- Edit profile details
- Deactivate account (with 14-day reactivation window)
- Logout

## 3. Authentication & Session Handling

### Authentication Flow

#### 1. What happens when the app starts

- `App.tsx` mounts providers in this order: `React Query` → `Auth` → `Onboarding` → `Navigation`.
- `RootNavigator` waits until both auth state and onboarding state are resolved.
- While loading, the app shows a loading screen.
- Routing logic:
  - Onboarding not completed → Onboarding flow (`OnboardingScreen`)
  - Onboarding completed and no authenticated user → Auth flow (`LoginScreen`)
  - Onboarding completed and authenticated user → Main app flow (`HomeScreen`)

#### 2. How authentication status is checked

- The auth hook (`useAuth`) subscribes to `Firebase Auth` via `onAuthStateChange`
- Firebase returns either a `user` object or `null`
- If user exists, the app fetches the user profile from `Firestore` (`users/{uid}`) using `Tanstack Query`
- When `user` exists the app has combined loading state that depends both on
  - auth listener loading
  - profile loading

#### 3. What happens on successful login or registration

- **Login**
  - `signInWithEmailAndPassword` succeeds
  - `Firebase` auth state changes and listener updates `user`
  - `RootNavigator` automatically switches from `Auth` stack to `MainApp` stack

- **Registration**
  - `createUserWithEmailAndPassword` creates auth account
  - a Firestore `user profile` document is created (`displayName`, `email`, `avatarUrl`, `createdAt`).
  - Default collections are seeded for the new user
  - `Auth` state is active immediately, so navigation transitions to the `Main App`.

- **Special case: Reactivated Account**
  - If account has been previously deactivated, the fetched user profile will have `deactivatedAt` field and in that case `reactivateAccount(uid)` call is made automatically after the login

## 4. What happens on logout

- `signOut` is called from the auth context
- Firebase auth state becomes `null`
- `RootNavigator` switches from `MainApp` to `Auth` stack and user is redirected to `LoginScreen`
- Usees then can log in again or change password

### Session Persistence

- ### How is the user session stored?
  - Session persistence is handled by the `Firebase Auth SDK` (native persistence on device)
  - The app does not manually store auth tokens in app code
  - The onboarding completion flag is stored separately in `AsyncStorage` (`@onboarding_completed`)

- ### How is automatic login handled after app restart?
  - On app restart, `onAuthStateChanged` call points to a persisted user and Firebase restores the previous auth session, so the user is logged in right away if their session is still valid
  - Then `RootNavigator` detects the authenticated user and sends them directly to the `Main App` (after loading checks)
  - If no persisted session exists, the user is sent to the `Auth` flow

## 4. Navigation Structure

```
RootNavigator (Native Stack)
├── OnboardingNavigator
├── AuthNavigator (Native Stack)
│   ├── LoginScreen
│   ├── SignupScreen
│   ├── ForgottenPasswordScreen
│   └── InfoScreen
└── MainAppNavigator (Native Stack)
    ├── TabNavigator (Bottom Tabs)  ← nested inside MainApp
    │   ├── HomeScreen
    │   ├── CollectionsScreen
    │   ├── InfoScreen
    │   └── ProfileNavigator (Native Stack)  ← nested inside Tabs
    │       ├── ProfileScreen
    │       ├── SettingsScreen
    │       └── EditProfileScreen
    └── EntryNavigator (Native Stack)  ← nested inside MainApp, renders over tabs
        ├── SelectedCollectionScreen
        ├── AddEntryScreen
        ├── EntryDetailsScreen
        ├── EditEntryScreen
        └── EntriesByTagScreen
```

### Root Navigation Logic

Navigation is managed by `RootNavigator`, a native stack that acts as a top-level router. It evaluates two conditions before rendering any screen:

- Whether the onboarding flow has been completed (checked via `AsyncStorage`)
- Whether there is an authenticated user (checked via `Firebase Auth`)

While either check is pending, a `LoadingScreen` is shown. Once both are resolved, routing has the following logic:

| Condition                            | Destination           |
| ------------------------------------ | --------------------- |
| Onboarding not completed             | `OnboardingNavigator` |
| Onboarding completed, no user        | `AuthNavigator`       |
| Onboarding completed, user logged in | `MainAppNavigator`    |

Navigation switches **automatically and reactively** — no manual redirect calls are made. When auth state changes (login or logout), the navigator re-evaluates and transitions instantly.

---

### Auth Navigation Logic

`AuthNavigator` is a native stack available only to unauthenticated users. It contains:

| Screen                    | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `LoginScreen`             | Email/password sign-in                                  |
| `SignupScreen`            | New Account Registration                                |
| `ForgottenPasswordScreen` | Password reset via email                                |
| `InfoScreen`              | Public app information (also accessible when logged in) |

### Main App Navigation Logic

Once authenticated, the user enters `MainAppNavigator` — a native stack with two children (nested navigators):

1. `TabNavigator` — the persistent bottom tab bar (primary navigation)
2. `EntryNavigator` — a full-screen stack for entry-related flows (pushed over the tabs)

#### Bottom Tabs (`TabNavigator`)

The tab bar has 4 tabs, built with `@react-navigation/bottom-tabs`:

| Tabs              | Screen/Navigator                  |
| ----------------- | --------------------------------- |
| **_Home_**        | `HomeScreen`                      |
| **_Collections_** | `CollectionsScreen`               |
| **_Info_**        | `InfoScreen`                      |
| **_Profile_**     | `ProfileNavigator` (nested stack) |

##### Nested Navigation

#### Profile Stack (`ProfileNavigator`)

The `Profile` tab hosts its own native stack navigator, enabling deeper navigation without pushing over the tab bar:

| Screen              | Description                       |
| ------------------- | --------------------------------- |
| `ProfileScreen`     | View profile details              |
| `SettingsScreen`    | Account settings and deactivation |
| `EditProfileScreen` | Edit display name, avatar, etc.   |

#### Entry Stack (`EntryNavigator`)

Entry-related screens are grouped in a separate native stack that sits above the tab bar in `MainAppNavigator`. `EntryNavigator` is entered by navigating to from 2 tabs (`Home` tab and `Collections` tab) - either by selecting a collection (landing on `SelectedCollectionScreen`) or by starting a new entry (**_spill_**) directly:

| Screen                     | Description                                |
| -------------------------- | ------------------------------------------ |
| `SelectedCollectionScreen` | Lists entries within a specific collection |
| `AddEntryScreen`           | Create a new entry                         |
| `EntryDetailsScreen`       | Read-only view of a single entry           |
| `EditEntryScreen`          | Edit an existing entry                     |
| `EntriesByTagScreen`       | Filter and view entries by tag             |

## 5. List → Details Flow

The app has two levels of list-to-detail navigation: `Collections` → `Entries` → `Entry Details`.

---

**_Level 1_**: Collections List (Overview Screens)
`Collections` are the primary browsable unit. They are displayed in two tabs:

### `HomeScreen`

- Displays the user's collections in a **2-column grid** of cards
- Each card shows the collection icon, name, and color
- Also shows a personalized greeting and the user's avatar (or image)
- The list is searchable (filters by collection name in real time)
- Supports **pull-to-refresh**

#### **User Interactions:**

| Action                             | Result                                                    |
| ---------------------------------- | --------------------------------------------------------- |
| Tap a collection card              | Navigates to `SelectedCollectionScreen` with collectionId |
| Tap **"Start without collection"** | Navigates directly to `AddEntryScreen`                    |
| Tap + button                       | Opens `AddCollectionModal`                                |
| Tap avatar                         | Navigates to `ProfileNavigator`                           |

### `CollectionsScreen`

- Displays all collections as a vertical list of `CollectionCard` components
- Each card shows icon, name, color, and live entry count (fetched per collection)
- The list is searchable (filters by collection name in real time)
- Supports **pull-to-refresh**

#### **User Interactions:**

| Action                    | Result                                                    |
| ------------------------- | --------------------------------------------------------- |
| Tap a collection card     | Navigates to `SelectedCollectionScreen` with collectionId |
| Tap edit icon on a card   | Opens `EditCollectionModal` for that collection           |
| Tap delete icon on a card | Shows confirmation alert then deletes                     |
| Tap + `FAB`               | Opens `AddCollectionModal`                                |

**_Level 2:_** Entries List (`SelectedCollectionScreen`)

- Entered from either `HomeScreen` or `CollectionsScreen` by tapping a collection
- Receives collectionId via route params
- Fetches and displays all entries belonging to that collection
- Each entry is rendered as an `EntrySummaryCard` showing title, date, tags, and a content preview
- The list is **searchable** (filters by title, content, or tags)

#### **User Interactions:**

| Action                                  | Result                                                            |
| --------------------------------------- | ----------------------------------------------------------------- |
| Tap an entry card                       | Navigates to `EntryDetailsScreen` with entryId                    |
| Tap a tag on a card                     | Navigates to `EntriesByTagScreen` with the selected tag           |
| Tap + `FAB` or `"Add your first spill"` | Navigates to `AddEntryScreen` with collectionId **pre-filled**    |
| Tap delete on a card                    | Shows confirmation alert then deletes the entry                   |
| Tap back                                | Returns to the previous tab (`HomeScreen` or `CollectionsScreen`) |

**_Level 3:_** Entry Details (`EntryDetailsScreen`)

- Receives entryId via route params
- Fetches the full entry document from `Firestore` using `useGetEntry(uid, entryId)`
- Also fetches all collections to resolve and display the entry's collection name and icon

**Displayed data:**

- Title (required)
- Written content (**expandable** if long) (required)
- Entry date
- Collection name and icon
- Location (if set)
- Tags (tappable — navigate to `EntriesByTagScreen`)
- Images (if attached)
- Videos (if attached, rendered with `VideoPlayer`)

#### **User Interactions:**

| Action          | Result                                                  |
| --------------- | ------------------------------------------------------- |
| Tap edit icon   | Navigates to `EditEntryScreen` with entryId             |
| Tap delete icon | Shows confirmation alert then deletes and goes back     |
| Tap a tag       | Navigates to `EntriesByTagScreen` with the selected tag |
| Tap back        | Returns to `SelectedCollectionScreen`                   |

## 6. Data Source & Backend

**_Backend Type_**

**Wordspill** uses a real `Firebase` backend — no mock or simulated data. The app communicates directly with `Firebase cloud services` for all data operations.

---

Firebase Services Used

| Service            | Purpose                                                      |
| ------------------ | ------------------------------------------------------------ |
| `Firebase Auth`    | User authentication (email/password)                         |
| `Firestore`        | Primary database for user profiles, collections, and entries |
| `Firebase Storage` | Media file storage (images and videos attached to entries)   |
| `Cloud Functions`  | Scheduled background jobs for account lifecycle management   |

**_Firestore Data Structure_**

All user data is nested under the user's own document, scoped by `uid`:

```
users/
└── {uid}/                          ← user profile document
    ├── displayName
    ├── email
    ├── avatarUrl
    ├── createdAt
    ├── deactivatedAt               ← set on deactivation, cleared on reactivation
    ├── collections/
    │   └── {collectionId}/         ← collection document
    │       ├── name
    │       ├── color
    │       ├── iconName
    │       ├── createdAt
    │       ├── updatedAt
    │       └── deletedAt           ← soft delete flag
    └── entries/
        └── {entryId}/              ← entry document
            ├── title
            ├── content
            ├── collectionId
            ├── tags[]
            ├── date
            ├── location
            ├── mediaUrls[]
            ├── createdAt
            ├── updatedAt
            └── deletedAt           ← soft delete flag

```

---

**_Soft Deletes_**

Collections and entries are not permanently deleted immediately. Instead, a `deletedAt` timestamp is written to the document. The app filters out records where `deletedAt` is set when fetching data. Permanent deletion of user data only happens via Cloud Functions when an account is fully purged after the 14-day deactivation window.

---

**_Firebase Storage_**

Media files (images and videos) attached to entries are uploaded to `Firebase Storage` under the path:

`{folder}/{userId}/{filename}`

After upload, the public download URL and storage path are stored alongside the entry in `Firestore`. Videos also store a `duration` field and an optional `thumbnailUrl`.

---

**_Cloud Functions (Scheduled Background Jobs)_**

Two scheduled functions run automatically on the `Firebase` backend:

| Function                    | Schedule             | Purpose                                                                                                                                                        |
| --------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deleteExpiredAccounts`     | Daily at 2:00 AM UTC | Finds accounts with deactivatedAt older than 14 days and permanently deletes their Firestore data (collections, entries, user doc) and `Firebase Auth` account |
| `sendDeactivationReminders` | Daily at 2:30 PM UTC | Sends reminder emails (via **_Resend_**) to users whose accounts are approaching the 14-day deletion deadline                                                  |

## 7. Data Oerations (CRUD)

All data operations are handled through a two-layer pattern:

- `Firebase functions` (`firestore.ts`) — raw Firestore calls
- `TanStack Query hooks` (`collections, entries, users`) — React hooks wrapping those calls with caching, loading states, and automatic UI updates

---

**_Read (GET)_**

Data is fetched using `useQuery` hooks. Queries are keyed by `userId` (and optionally `collectionId`, `entryId`, or tag) so the cache is scoped per user and per resource.

| Hook                                           | Query Key                                      | Data Fetched                   | Used In                                                                             |
| ---------------------------------------------- | ---------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| `useGetAllCollections(uid)`                    | `['collections', uid]`                         | All non-deleted collections    | `HomeScreen`, `CollectionsScreen`, `SelectedCollectionScreen`, `EntryDetailsScreen` |
| `useGetEntries(uid)`                           | `['entries', uid]`                             | All non-deleted entries        | `HomeScreen`                                                                        |
| `useGetEntriesByCollection(uid, collectionId)` | `['entries', uid, 'collection', collectionId]` | Entries filtered by collection | `SelectedCollectionScreen`, `CollectionsScreen` (entry count)                       |
| `useGetEntry(uid, entryId)`                    | `['entries', uid, entryId]`                    | Single entry by ID             | `EntryDetailsScreen`                                                                |
| `useGetEntriesByTag(uid, tag)`                 | `['entries', uid, 'tag', tag]`                 | Entries filtered by tag        | `EntriesByTagScreen`                                                                |
| `useGetUser(uid)`                              | `['users', uid]`                               | User profile document          | `useAuth` hook, `ProfileScreen`                                                     |

All queries are **disabled** when `userId` is not yet available (before auth resolves), using the `enabled: !!userId` option.

---

**_Create (POST)_**

New data is created through form screens that call `useMutation` hooks on submit.

| What             | Hook                                | Trigger                        | After Success                             |
| ---------------- | ----------------------------------- | ------------------------------ | ----------------------------------------- |
| New collection   | `useCreateCollection(uid)`          | Submit in `AddCollectionModal` | Modal closes, list refreshes              |
| New entry        | `useCreateEntry(uid)`               | Submit in `AddEntryScreen`     | Goes back to `SelectedCollectionScreen`   |
| New user profile | Direct `setDoc` in `registerUser()` | On registration                | Handled by auth flow, not a mutation hook |

When creating an entry without a selected collection, the entry is automatically assigned to the default **_"In Limbo"_** collection.

---

**_Update_**

| What               | Hook                           | Trigger                         | After Success                               |
| ------------------ | ------------------------------ | ------------------------------- | ------------------------------------------- |
| Edit entry         | `useUpdateEntry(uid, entryId)` | Submit in `EditEntryScreen`     | Goes back to `EntryDetailsScreen`           |
| Edit collection    | `useUpdateCollection(uid)`     | Submit in `EditCollectionModal` | Modal closes, list refreshes                |
| Edit user profile  | `useUpdateUser(uid)`           | Submit in `EditProfileScreen`   | Goes back to `ProfileScreen`                |
| Deactivate account | `useDeactivateAccount(uid)`    | Confirm in `SettingsScreen`     | User is logged out, sent to `AuthNavigator` |

---

**_Delete_**

| What                  | Hook                                                   | Trigger                                                             | Result                                                       |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Delete entry          | `useDeleteEntry(uid, entryId)` or inline `useMutation` | Confirm alert in `EntryDetailsScreen` or `SelectedCollectionScreen` | **Soft delete** — sets `deletedAt` timestamp, navigates back |
| Delete collection     | `useDeleteCollection(uid)`                             | Confirm alert in `CollectionsScreen`                                | **Soft delete** — sets `deletedAt` timestamp, list refreshes |
| Delete account (full) | Cloud Function (`deleteExpiredAccounts`)               | Automatic, 14 days after `deactivatedAt`                            | Permanent — removes Firestore docs + `Firebase Auth` account |

---

**_How the UI Updates After a Mutation_**

All mutation hooks follow the same pattern: on `onSuccess`, they call `queryClient.invalidateQueries()` targeting the affected query key. This signals `TanStack Query` to refetch the relevant data from `Firestore`, which automatically re-renders any component subscribed to that query.

**Example — deleting a collection:**

1. `deleteCollection(userId, collectionId)` writes `deletedAt` to `Firestore`
2. `onSuccess` → `invalidateQueries({ queryKey: ['collections', userId] })`
3. `useGetAllCollections` refetches → returns list excluding the soft-deleted item
4. `CollectionsScreen` and `HomeScreen` re-render with the updated list automatically

No manual state updates or local array splicing are used. The cache invalidation → refetch cycle keeps all screens in sync.

## 8. Forms & Validation (also list of all forms and validation rules included)

The app uses **no form library** (no React Hook Form, Formik, etc.). All forms are managed with plain `useState` hooks and custom inline validation functions.

---

**_Forms Used_**

| Screen                    | Fields                                                                |
| ------------------------- | --------------------------------------------------------------------- |
| `LoginScreen`             | Email, Password                                                       |
| `SignupScreen`            | Name, Email, Password, Confirm Password                               |
| `ForgottenPasswordScreen` | Email                                                                 |
| `AddEntryScreen`          | Title, Content, Date, Collection, Tags, Location, Header Image, Media |
| `EditEntryScreen`         | Same as Add Entry, pre-filled with existing values                    |
| `EditProfileScreen`       | Display Name, Avatar                                                  |
| `AddCollectionModal`      | Name, Color, Icon                                                     |
| `EditCollectionModal`     | Name                                                                  |

---

**_Validation Approach_**

Auth screens (`LoginScreen`, `SignupScreen`) use a `validateForm()` function that runs on submit, sets an `errors` state object, and displays inline error messages under each field.

Entry screens (`AddEntryScreen`, `EditEntryScreen`) use `Alert.alert()` to surface missing required fields on submit — no inline field-level error display.

**Auth validation rules:**

| Field            | Rules                                                                                |
| ---------------- | ------------------------------------------------------------------------------------ |
| Email            | Required, must match `/\S+@\S+\.\S+/`                                                |
| Password         | Required, min 8 characters, must contain a letter, a number, and a special character |
| Confirm Password | Required, must match Password                                                        |
| Name             | Required (non-empty after trim)                                                      |

**Entry validation rules:**

| Field   | Rule                              |
| ------- | --------------------------------- |
| Title   | Required — `Alert` shown if empty |
| Content | Required — `Alert` shown if empty |

## 9. Native Device Features

The app uses two native device features: **Camera / Image Picker** and **Location**.

---

**_Camera / Image Picker_** (`expo-image-picker`)

Used in `AddEntryScreen` and `EditEntryScreen` for attaching media to entries.

There are two distinct media attachment points per entry:

- **Header image** — a single banner-style image displayed at the top of the entry. The user is prompted with an `Alert` offering two options:
  - _Take Photo_ — opens the device camera (`launchCameraAsync`) with a 16:9 crop and 0.8 quality
  - _Choose from Library_ — opens the photo library (`launchImageLibraryAsync`) restricted to images only, with the same crop settings

- **Media items** — up to 5 additional images or videos attached to the entry body. These are always picked from the library (`launchImageLibraryAsync`) and support both `images` and `videos` media types.

Permissions requested:

- `requestCameraPermissionsAsync()` — before launching the camera
- `requestMediaLibraryPermissionsAsync()` — before accessing the photo library

If either permission is denied, an `Alert` is shown with guidance to enable it in device settings.

---

**_Location_** (`expo-location`)

Used via the `LocationPicker` component in `AddEntryScreen` and `EditEntryScreen`. Location is an optional field on an entry.

The component offers two input modes:

- **Auto (GPS)** — calls `requestForegroundPermissionsAsync()`, then `getCurrentPositionAsync()` with `Accuracy.Balanced`. On success, it also runs `reverseGeocodeAsync()` to convert coordinates into a human-readable city/region/country string. If reverse geocoding fails, coordinates alone are stored.
- **Manual** — a text input where the user types a free-form address directly. No GPS or geocoding is used in this path.

The resolved location (`latitude`, `longitude`, `address`) is stored on the entry document in Firestore and displayed in `EntryDetailsScreen`.

Permissions requested:

- `requestForegroundPermissionsAsync()` — before fetching GPS position

If permission is denied or location services are disabled, an `Alert` is shown explaining the issue.

## 10. Typical User Flow

### First-Time User

1. **Onboarding** — The user opens the app for the first time and is taken through the onboarding flow. On completion, the `@onboarding_completed` flag is saved to `AsyncStorage`. The user will never see onboarding again on this device.
2. **Registration** — The user is sent to `AuthNavigator` and taps _Sign up_. They fill in name, email, password, and confirm password. On success, a Firestore profile document is created and a set of default collections is seeded for their account. They are automatically navigated into the main app.
3. **Exploring the Home screen** — The user lands on `HomeScreen` and sees their default collections displayed as a grid. They are greeted by name.
4. **Creating a first entry** — The user taps a collection card (e.g. _"Travel"_) and is taken to `SelectedCollectionScreen`. They tap the `+` FAB, which opens `AddEntryScreen`. They write a title and some content, optionally add a tag, a photo, or their current location, and tap _Save_. The entry is saved to Firestore and the user is returned to `SelectedCollectionScreen` where the new entry appears.

---

### Returning User

1. **Auto-login** — The user reopens the app. Firebase restores the persisted session via `onAuthStateChanged`. The `LoadingScreen` shows briefly while auth and onboarding states resolve, then the user lands directly on `HomeScreen`.
2. **Browsing entries** — The user taps a collection on `HomeScreen` or navigates to the `Collections` tab, selects a collection, and scrolls through their entries. They use the search bar to filter by title, content, or tag.
3. **Reading an entry** — The user taps an `EntrySummaryCard` to open `EntryDetailsScreen`, where the full entry is shown including content, date, location, tags, images, and videos.
4. **Editing an entry** — From `EntryDetailsScreen`, the user taps the edit icon and is taken to `EditEntryScreen` with all fields pre-filled. They make changes and save. `TanStack Query` invalidates the cache and the updated entry is reflected immediately across all screens.
5. **Browsing by tag** — The user taps a tag on any entry card or in `EntryDetailsScreen`. They are taken to `EntriesByTagScreen`, which lists all entries sharing that tag across all collections.

---

### Account Deactivation & Reactivation

1. **Deactivation** — The user navigates to `ProfileTab` → `Settings`. They choose to deactivate their account. A `deactivatedAt` timestamp is written to their Firestore profile and they are signed out, landing on `LoginScreen`.
2. **14-day window** — A daily Cloud Function checks for accounts deactivated more than 14 days ago. A reminder email is sent via _Resend_ as the deadline approaches.
3. **Reactivation** — If the user logs back in within 14 days, the app detects the `deactivatedAt` field on the profile and automatically calls `reactivateAccount(uid)`, which clears the field. The user is seamlessly sent to `HomeScreen` with their data intact.
4. **Permanent deletion** — If the 14-day window passes without login, the Cloud Function permanently deletes the user's collections, entries, Firestore profile document, and Firebase Auth account.

## 11. Error & Edge Case Handling

### Authentication Errors

Auth errors are caught in `try/catch` blocks on each auth screen and surfaced via `Alert.alert()` with a user-friendly message. Firebase error codes are mapped to readable strings before display — no raw Firebase error codes are shown to the user.

| Screen                    | Error Code                  | Message Shown                                 |
| ------------------------- | --------------------------- | --------------------------------------------- |
| `LoginScreen`             | `auth/user-not-found`       | _"No account found with this email"_          |
| `LoginScreen`             | `auth/wrong-password`       | _"Incorrect password"_                        |
| `LoginScreen`             | `auth/invalid-credential`   | _"Invalid email or password"_                 |
| `LoginScreen`             | anything else               | _"Login failed. Please try again."_           |
| `SignupScreen`            | `auth/email-already-in-use` | _"An account with this email already exists"_ |
| `SignupScreen`            | `auth/weak-password`        | _"Password is too weak"_                      |
| `SignupScreen`            | `auth/invalid-email`        | _"Invalid email address"_                     |
| `ForgottenPasswordScreen` | `auth/user-not-found`       | _"No account found with this email"_          |
| `ForgottenPasswordScreen` | `auth/invalid-email`        | _"Invalid email address"_                     |

---

### Network or Data Errors

Data errors from Firestore are handled at the query and mutation level:

- **Query errors** — `TanStack Query` exposes an `error` state alongside `isLoading`. Screens that use it (`HomeScreen`, `EntriesByTagScreen`, `SelectedCollectionScreen`, `EntryDetailsScreen`) render an inline error message in place of the list when `error` is truthy (e.g. _"Error loading spills"_).
- **Mutation errors** — Failures in create/update/delete mutations (e.g. saving an entry, updating a collection) are caught in `try/catch` and shown via `Alert.alert('Error', ...)` with a short description.
- **Media upload errors** — Failures when uploading images or videos to Firebase Storage are caught and shown as `Alert.alert('Error', 'Failed to upload image')`.
- **Logout errors** — If `signOut` fails, `Alert.alert('Error', 'Failed to logout. Please try again.')` is shown.

---

### Empty or Missing Data States

Screens account for the case where a query returns an empty result or a resource is not found:

| Screen                     | Empty State Shown                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `HomeScreen`               | _"No collections match your search"_ (search active) / _"No collections yet. Start creating entries!"_ (no collections) |
| `CollectionsScreen`        | _"No Collections Found"_ (search active) / _"No Collections Yet"_ (no collections)                                      |
| `SelectedCollectionScreen` | _"No Spills Found"_ (search active) / _"No Spills Yet"_ + _"Add Your First Spill"_ button (empty collection)            |
| `EntriesByTagScreen`       | _"Tag not found"_ if tag param is missing / error message if fetch fails                                                |
| `EntryDetailsScreen`       | _"Entry not found"_ if `entryId` resolves to nothing                                                                    |
| `SelectedCollectionScreen` | _"Collection not found"_ if `collectionId` param resolves to no matching collection                                     |

Loading states are handled with inline text (e.g. _"Loading spills..."_) rendered in place of the list while `isLoading` is true.

# 📱 InteractiveLearning App (Frontend Only)

A learning app built with **React Native + Expo**, designed to run **natively** (not via Expo Go).

---

## ⚙️ Prerequisites

Make sure your machine is ready for development with the following installed:

### ✅ System Requirements
- Node.js (LTS recommended) → [https://nodejs.org/](https://nodejs.org/)
- npm (comes with Node.js)
- Git → [https://git-scm.com/](https://git-scm.com/)
- Android Studio + SDK (for running on Android emulator or device)

### 🔧 Global Tools Installation

Install the Expo CLI globally:

```bash
npm install -g expo-cli
```

Ensure you have JDK & Android Studio set up for native builds. Follow the official guide:
[https://docs.expo.dev/workflow/android-studio-emulator/](https://docs.expo.dev/workflow/android-studio-emulator/)

---

## 🚀 Setup & Run (Native)

### 1. Clone the Repository

```bash
git clone https://github.com/YouriLangh/InteractiveLearning.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Clean Up Metro Cache *(optional but recommended)*

```bash
npx expo start --clear
```

### 4. Build and Run Natively on Android

```bash
npx expo run:android
```

---

## 📁 Project Structure

```
interactivelearning/
├─ app/                # Expo Router pages
├─ components/         # Shared reusable components
├─ assets/             # Images, icons, fonts, etc.
├─ index.tsx           # App entry point
├─ babel.config.js     # Babel configuration
├─ tsconfig.json       # TypeScript configuration
└─ package.json        # Project metadata and scripts
```

---
> 💡 **Note:** Use a real device/emulator for native builds (Expo Go unsupported). Update `app.json` with your private IP and backend port.

**Fixing Build Problems (React Native/Expo)**

If you run into any build problems:

1. Delete the `android` folder.
2. Delete the `.expo` folder.
3. Run the following command to clean and rebuild:

```bash
npx expo prebuild --clean
```

4. Then run the app natively:

```bash
npx expo run:android
```

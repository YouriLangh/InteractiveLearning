# Welcome to BlockEd 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).  
Note before the documentation, none of this has been tested on Unix or iOS, we only guarantee that the app works on Android.

## Get started

Before you get started, first download Android Studio. Even when not using an android emulator, we still need access to the SDK to build our project.  
Do NOT remove the android virtual device option.  
Once this is done, look for the SDK Manager setting and copy the path of the Sdk. This path can also be found in the settings under Languages & Framework/Android SDK  
Add an environment variable ANDROID_HOME with as value the path you copied.

1. Install dependencies  
   In the root of the project:

```bash
npm install
```

Go to the Issues section after this and before attempting to run the app, Issues 1-4 are required to solve to run the project for the first time.

2. Convert the project into a bare workflow (development) as react-native-camera-vision does not work on expo

```bash
npx expo prebuild
```

3. If testing the app on a real device:

- Enable USB debugging on your android device in the settings. It is possible that this setting is not visible, you can enable developer options by pressing the serial number seven times. (can be found in e.g.: settings/About tablet/Status Information)
- Download the Expo Go app from the play store.

Otherwise just start the emulator.

4. Builds and run the app on an emulator or device (android or ios)

```bash
npx expo run:android
```

In the output, you'll find options to open the app in:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Normally the app should open automatically on your connected device after the apk is installed. If not, pressing R in the terminal will refresh the app if an error occurred in the app. Pressing A will open the app on the android device again.

5. Update the "apiUrl" field in app.json to your local IP.

## Setting Up the Video Streaming Service

1. **Install the IP Webcam app** on your Android device.

2. **Configure the following settings** in the app:

   - **Video resolution:** `960x720` or `720x720`. Any resolution is fine, lower helps with latency. But the resolution affects the captured view shown on the device.
   - **Photo resolution:** `1440x1440`  
     _(This ensures consistent computer vision performance, even when the phone is rotated.)_

3. **Start the local server** by tapping the play button in the top-right corner of the app.  
   The streaming IP address will appear at the bottom of the screen.

4. **Update the IP in the application**:  
   In `StudentLearnScreen.tsx`, update the IP address to match the one shown by the IP Webcam app.

5. **Note for testing**:  
   The metal rod on the tripod used during tests was approximately **22 cm** long.

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

## 📁 Project Structure

```
interactivelearning/
├─ app/                 # Expo Router pages
├─ assets/              # Images, icons, fonts, etc.
├─ config/              # Global config files (e.g. base URLs, env setup)
│  └─ config.ts
├─ context/             # React context providers
│  └─ AuthContext.tsx
├─ services/            # API logic and storage handling
│  ├─ api.ts
│  ├─ authService.ts
│  ├─ secureStorage.ts
│  └─ tokenService.ts
├─ types/               # TypeScript types and interfaces
│  └─ index.ts
├─ .gitignore           # Git ignore rules
├─ app.json             # Expo app configuration
├─ babel.config.js      # Babel config for React Native
├─ expo-env.d.ts        # Expo environment type declarations
├─ tsconfig.json        # TypeScript configuration
├─ package.json         # Project dependencies and scripts
└─ README.md            # Project documentation
```

---

> 💡 **Note:** Use a real device/emulator for native builds (Expo Go unsupported).  
> Update `app.json` with your private IP and backend port.

---

## Developing

You can start developing by editing the files inside the **app** directory.  
This project uses [file-based routing](https://docs.expo.dev/router/introduction).

---

## Issues

### Issue 1: Build/Kotlin Issues

If you have any issues such as Kotlin debug issues, perform:

```bash
cd android && gradlew clean
```

If this doesn't work, remove the .gradle folder in the android folder and try the above command again.

Alternatively:

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

---

### Issue 2: Set your app's minSdk version to 26 and try again

(Perhaps just when using the android tablet emulator, its Sdk is 24+, not 26+)  
You can perhaps avoid this by using the Pixel tablet virtual device.  
Go into the android folder and alter line 6 in the build.gradle to be:

```gradle
minSdkVersion = 26
```

```bash
cd android && gradlew clean
```

### Issue 3: Length of path is limited OR other path issues

Do not download this project in any OneDrive directory or in any deeply nested locations.  
An example of a good path (no spaces) is `C:\NGUI\%PROJECT%`

---

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/)
- [Guides](https://docs.expo.dev/guides)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)

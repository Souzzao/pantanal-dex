// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

// Duas versões a partir do mesmo código (veja shared/variant.ts):
//   APP_VARIANT=demo        → "PantanalDex Demo", pacote ...demo (instala junto da final), caderno Teste e auditoria simulada
//   APP_VARIANT=production  → versão final para a Google Play (padrão quando a variável não existe)
const variant = (process.env.APP_VARIANT ?? process.env.EXPO_PUBLIC_APP_VARIANT ?? "production").trim().toLowerCase() === "demo" ? "demo" : "production";
process.env.EXPO_PUBLIC_APP_VARIANT = variant; // o Expo embute EXPO_PUBLIC_* no app
const isDemo = variant === "demo";

// Identificador do app na Play Store. Depois da primeira publicação NÃO pode mais mudar.
const basePackage = "com.app.pantanaldex";

const env = {
  appName: isDemo ? "PantanalDex Demo" : "PantanalDex",
  appSlug: "pantanal-dex",
  // Esquema próprio para links que abrem o app (pantanaldex://...). Não usa curinga de domínio.
  scheme: isDemo ? "pantanaldex-demo" : "pantanaldex",
  iosBundleId: isDemo ? `${basePackage}.demo` : basePackage,
  androidPackage: isDemo ? `${basePackage}.demo` : basePackage,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "3.9.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
    "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
  },
  android: {
    versionCode: 6,
    adaptiveIcon: {
      backgroundColor: "#0D0D0D",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    // Backup automático do Android desligado: os avistamentos (com local exato) não vão para a nuvem
    // do Google sem a pessoa escolher; para levar a outro aparelho, use Exportar.
    allowBackup: false,
    // Só as permissões que o app usa de fato; as que bibliotecas costumam trazer são removidas.
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION", "CAMERA", "INTERNET"],
    blockedPermissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.ACCESS_BACKGROUND_LOCATION",
      "android.permission.SYSTEM_ALERT_WINDOW",
      "android.permission.READ_PHONE_STATE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_EXTERNAL_STORAGE",
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-location",
      {
        locationWhenInUsePermission: "Permita que o PantanalDex registre o local do seu avistamento enquanto você usa o app.",
      },
    ],
    [
      "expo-image-picker",
      {
        cameraPermission: "Permita que o PantanalDex use a câmera para registrar avistamentos.",
        photosPermission: "Permita que o PantanalDex acesse fotos para anexá-las aos avistamentos.",
        microphonePermission: false,
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#0D0D0D",
        dark: {
          backgroundColor: "#0D0D0D",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          minSdkVersion: 24,
        },
      },
    ],
  ],
  extra: {
    variant,
    eas: {
      projectId: "f8dd1e6d-bf7b-433b-bbb3-38e7e565b50b",
    },
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;

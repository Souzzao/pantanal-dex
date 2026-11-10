import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/use-colors";
import { validateSignUp } from "@/shared/auth";

const TEXT = {
  pt: {
    tagline: "Guia de campo e caderno de avistamentos", signIn: "Entrar", signUp: "Criar conta", name: "Seu nome (aparece para os auditores)", email: "E-mail", password: "Senha (mínimo 8 caracteres)", show: "Mostrar", hide: "Ocultar",
    toSignUp: "Ainda não tem conta? Criar conta", toSignIn: "Já tem conta? Entrar", offlineHint: "Depois do primeiro acesso, sua conta continua aberta sem internet: o caderno e o catálogo funcionam offline.",
    errors: { email: "Confira o e-mail.", password: "A senha precisa ter pelo menos 8 caracteres.", name: "Escreva um nome de 2 a 40 letras.", invalid: "E-mail ou senha incorretos.", exists: "Já existe uma conta com esse e-mail. Use Entrar.", network: "Sem internet. Para o primeiro acesso é preciso estar conectado.", confirm: "Confirme o e-mail antes de entrar (veja sua caixa de entrada).", weak: "Senha fraca: use pelo menos 8 caracteres, misturando letras e números.", rate: "Muitas tentativas. Espere um minuto e tente de novo.", unknown: "Não foi possível entrar agora. Tente de novo." },
    confirmSent: "Conta criada. Confirme o e-mail que enviamos e depois entre.",
  },
  en: {
    tagline: "Field guide and sightings notebook", signIn: "Sign in", signUp: "Create account", name: "Your name (shown to reviewers)", email: "Email", password: "Password (at least 8 characters)", show: "Show", hide: "Hide",
    toSignUp: "No account yet? Create account", toSignIn: "Already have an account? Sign in", offlineHint: "After the first sign-in, your account stays open without internet: the notebook and catalog work offline.",
    errors: { email: "Check the email.", password: "The password needs at least 8 characters.", name: "Type a name with 2 to 40 letters.", invalid: "Wrong email or password.", exists: "An account with this email already exists. Use Sign in.", network: "No internet. The first sign-in needs a connection.", confirm: "Confirm your email before signing in (check your inbox).", weak: "Weak password: use at least 8 characters with letters and numbers.", rate: "Too many attempts. Wait a minute and try again.", unknown: "Could not sign in now. Try again." },
    confirmSent: "Account created. Confirm the email we sent, then sign in.",
  },
  es: {
    tagline: "Guía de campo y cuaderno de avistamientos", signIn: "Entrar", signUp: "Crear cuenta", name: "Tu nombre (lo ven los auditores)", email: "Correo", password: "Contraseña (mínimo 8 caracteres)", show: "Mostrar", hide: "Ocultar",
    toSignUp: "¿No tienes cuenta? Crear cuenta", toSignIn: "¿Ya tienes cuenta? Entrar", offlineHint: "Después del primer acceso, tu cuenta sigue abierta sin internet: el cuaderno y el catálogo funcionan sin conexión.",
    errors: { email: "Revisa el correo.", password: "La contraseña necesita al menos 8 caracteres.", name: "Escribe un nombre de 2 a 40 letras.", invalid: "Correo o contraseña incorrectos.", exists: "Ya existe una cuenta con ese correo. Usa Entrar.", network: "Sin internet. El primer acceso necesita conexión.", confirm: "Confirma tu correo antes de entrar (revisa tu bandeja).", weak: "Contraseña débil: usa al menos 8 caracteres con letras y números.", rate: "Demasiados intentos. Espera un minuto e inténtalo de nuevo.", unknown: "No se pudo entrar ahora. Inténtalo de nuevo." },
    confirmSent: "Cuenta creada. Confirma el correo que enviamos y luego entra.",
  },
} as const;

type ErrorKey = keyof (typeof TEXT)["pt"]["errors"];

export function LoginScreen() {
  const colors = useColors();
  const { settings } = useApp();
  const { signIn, signUp } = useAuth();
  const t = TEXT[settings.defaultLanguage === "English" ? "en" : settings.defaultLanguage === "Español" ? "es" : "pt"];
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorKey | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setInfo(null);
    if (mode === "signUp") {
      const invalid = validateSignUp({ email, password, displayName: name });
      if (invalid) return setError(invalid as ErrorKey);
    } else if (!email.trim() || !password) {
      return setError(!email.trim() ? "email" : "password");
    }
    setBusy(true);
    try {
      if (mode === "signIn") {
        const result = await signIn(email, password);
        if (result.error) setError(result.error);
      } else {
        const result = await signUp(email, password, name);
        if (result.error) setError(result.error);
        else if (result.needsConfirmation) { setInfo(t.confirmSent); setMode("signIn"); }
      }
    } finally {
      setBusy(false);
    }
  };

  const input = (props: React.ComponentProps<typeof TextInput>) => (
    <TextInput placeholderTextColor={colors.muted} editable={!busy} {...props}
      style={[{ color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 16 }, props.style]} />
  );

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }} keyboardShouldPersistTaps="handled">
          <Text accessibilityRole="header" style={{ color: colors.primary, fontSize: 34, fontWeight: "900", textAlign: "center" }}>PantanalDex</Text>
          <Text style={{ color: colors.muted, textAlign: "center", marginTop: 6, marginBottom: 28 }}>{t.tagline}</Text>

          <View style={{ gap: 12 }}>
            {mode === "signUp" && input({ value: name, onChangeText: setName, placeholder: t.name, accessibilityLabel: t.name, autoCapitalize: "words", textContentType: "name", maxLength: 40 })}
            {input({ value: email, onChangeText: setEmail, placeholder: t.email, accessibilityLabel: t.email, autoCapitalize: "none", autoCorrect: false, keyboardType: "email-address", textContentType: "emailAddress", autoComplete: "email" })}
            <View>
              {input({ value: password, onChangeText: setPassword, placeholder: t.password, accessibilityLabel: t.password, secureTextEntry: !showPassword, autoCapitalize: "none", textContentType: mode === "signUp" ? "newPassword" : "password", autoComplete: mode === "signUp" ? "new-password" : "current-password", onSubmitEditing: () => void submit(), style: { paddingRight: 84 } })}
              <Pressable onPress={() => setShowPassword((v) => !v)} accessibilityRole="button" style={{ position: "absolute", right: 10, top: 0, bottom: 0, justifyContent: "center", paddingHorizontal: 8 }}>
                <Text style={{ color: colors.primary, fontWeight: "700" }}>{showPassword ? t.hide : t.show}</Text>
              </Pressable>
            </View>
          </View>

          {error && <Text accessibilityLiveRegion="assertive" style={{ color: colors.error, marginTop: 12, fontWeight: "600" }}>{t.errors[error]}</Text>}
          {info && <Text accessibilityLiveRegion="polite" style={{ color: colors.success, marginTop: 12, fontWeight: "600" }}>{info}</Text>}

          <Pressable onPress={() => void submit()} disabled={busy} accessibilityRole="button" accessibilityState={{ disabled: busy, busy }}
            style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 15, marginTop: 18, alignItems: "center" }, (pressed || busy) && { opacity: 0.8 }]}>
            {busy ? <ActivityIndicator color={colors.background} /> : <Text style={{ color: colors.background, fontWeight: "800", fontSize: 16 }}>{mode === "signIn" ? t.signIn : t.signUp}</Text>}
          </Pressable>

          <Pressable onPress={() => { setMode(mode === "signIn" ? "signUp" : "signIn"); setError(null); setInfo(null); }} accessibilityRole="button" style={{ paddingVertical: 16 }}>
            <Text style={{ color: colors.primary, textAlign: "center", fontWeight: "700" }}>{mode === "signIn" ? t.toSignUp : t.toSignIn}</Text>
          </Pressable>

          <Text style={{ color: colors.muted, textAlign: "center", fontSize: 12, lineHeight: 18 }}>{t.offlineHint}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

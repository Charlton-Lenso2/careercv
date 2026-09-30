import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

type Mode = "login" | "register";

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const isRegister = mode === "register";

  function validate(): string | null {
    if (!email.includes("@") || !email.includes(".")) {
      return "Please enter a valid email address.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    return null;
  }

  async function handleSubmit() {
    setError(null);
    setInfo(null);

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setInfo("Account created. Check your email to confirm it, then log in.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>CareerCV</Text>
      <Text style={styles.subtitle}>
        {isRegister ? "Create your account" : "Log in to your account"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 8 characters)"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}
      {info && <Text style={styles.info}>{info}</Text>}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>
            {isRegister ? "Register" : "Log in"}
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => {
          setMode(isRegister ? "login" : "register");
          setError(null);
          setInfo(null);
        }}
      >
        <Text style={styles.switchText}>
          {isRegister
            ? "Already have an account? Log in"
            : "New here? Create an account"}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#4b5563", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#ffffff", fontWeight: "600", fontSize: 16 },
  switchText: { textAlign: "center", color: "#2563eb" },
  error: { color: "#dc2626", marginBottom: 8 },
  info: { color: "#15803d", marginBottom: 8 },
});
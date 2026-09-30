import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";
import { apiFetch, ApiError } from "../services/api";

type MeResponse = {
  success: boolean;
  user: { id: string; email?: string };
};

export default function HomeScreen() {
  const [me, setMe] = useState<MeResponse["user"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<MeResponse>("/api/me")
      .then((res) => setMe(res.user))
      .catch((e) =>
        setError(e instanceof ApiError ? e.message : "Something went wrong.")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You're logged in</Text>

      {loading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
      {me && (
        <View style={styles.card}>
          <Text style={styles.label}>Verified by the CareerCV API</Text>
          <Text style={styles.value}>{me.email}</Text>
          <Text style={styles.small}>{me.id}</Text>
        </View>
      )}

      <Pressable style={styles.button} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: { color: "#4b5563", marginBottom: 4 },
  value: { fontSize: 18, fontWeight: "600" },
  small: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  error: { color: "#dc2626", marginBottom: 16 },
  button: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  buttonText: { color: "#ffffff", fontWeight: "600", fontSize: 16 },
});
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000";

type CheckResult = { loading: boolean; ok: boolean; detail: string };

const initial: CheckResult = { loading: true, ok: false, detail: "Checking..." };

async function runCheck(path: string): Promise<CheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${API_URL}${path}`, { signal: controller.signal });
    const data = await res.json();
    return {
      loading: false,
      ok: res.ok && data.success === true,
      detail: JSON.stringify(data),
    };
  } catch {
    return { loading: false, ok: false, detail: "Could not reach the API." };
  } finally {
    clearTimeout(timer);
  }
}

function StatusRow({ label, result }: { label: string; result: CheckResult }) {
  const dotColor = result.loading ? "#9ca3af" : result.ok ? "#22c55e" : "#ef4444";

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.detail}>{result.detail}</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [api, setApi] = useState<CheckResult>(initial);
  const [db, setDb] = useState<CheckResult>(initial);

  useEffect(() => {
    runCheck("/api/health").then(setApi);
    runCheck("/api/health/db").then(setDb);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CareerCV: system check</Text>
      <StatusRow label="Backend API" result={api} />
      <StatusRow label="Database" result={db} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 64, backgroundColor: "#ffffff" },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 16 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  rowText: { flex: 1 },
  label: { fontWeight: "600" },
  detail: { fontSize: 12, color: "#4b5563", marginTop: 2 },
});
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SECTIONS } from "../config/sections";
import { useProfile } from "../context/ProfileContext";
import { supabase } from "../lib/supabase";
import type { RootStackParamList } from "../navigation/types";
import { itemsOf } from "../services/profile.api";
import { Button, colors } from "../ui/components";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
  const { profile, loading, error, refresh } = useProfile();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? "Could not load your profile."}</Text>
        <Button title="Try again" onPress={refresh} />
        <View style={styles.gap} />
        <Button
          title="Log out"
          variant="secondary"
          onPress={() => supabase.auth.signOut()}
        />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.headerCard}>
        <Text style={styles.name}>{profile.fullName?.trim() || "Add your name"}</Text>
        {profile.headline ? <Text style={styles.headline}>{profile.headline}</Text> : null}
        {profile.location ? <Text style={styles.muted}>{profile.location}</Text> : null}
        <Text style={styles.summary}>
          {profile.summary?.trim() || "No professional summary yet."}
        </Text>
        <View style={styles.gap} />
        <Button
          title="Edit personal info"
          variant="secondary"
          onPress={() => navigation.navigate("EditPersonal")}
        />
      </View>

      <Text style={styles.sectionTitle}>Your career data</Text>

      {SECTIONS.map((section) => (
        <Pressable
          key={section.key}
          style={styles.row}
          onPress={() => navigation.navigate("SectionList", { sectionKey: section.key })}
        >
          <Text style={styles.rowLabel}>{section.label}</Text>
          <Text style={styles.rowCount}>{itemsOf(profile, section.key).length}  ›</Text>
        </Pressable>
      ))}

      <View style={styles.gap} />
      <Button title="Log out" variant="secondary" onPress={() => supabase.auth.signOut()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background },
  content: { padding: 20, backgroundColor: colors.background },
  headerCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    backgroundColor: colors.surface,
  },
  name: { fontSize: 22, fontWeight: "700" },
  headline: { fontSize: 16, marginTop: 2 },
  muted: { color: colors.muted, marginTop: 2 },
  summary: { marginTop: 10, color: colors.text },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  rowLabel: { fontSize: 16 },
  rowCount: { color: colors.muted },
  errorText: { color: colors.danger, marginBottom: 12 },
  gap: { height: 12 },
});
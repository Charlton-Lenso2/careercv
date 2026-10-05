import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { findSection } from "../config/sections";
import { useProfile } from "../context/ProfileContext";
import type { RootStackParamList } from "../navigation/types";
import { itemsOf } from "../services/profile.api";
import { Button, colors } from "../ui/components";

type Props = NativeStackScreenProps<RootStackParamList, "SectionList">;

export default function SectionListScreen({ navigation, route }: Props) {
  const section = findSection(route.params.sectionKey);
  const { profile } = useProfile();

  useLayoutEffect(() => {
    navigation.setOptions({ title: section?.label ?? "Section" });
  }, [navigation, section]);

  if (!section || !profile) return null;

  const items = itemsOf(profile, section.key);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Button
        title={`Add ${section.singular.toLowerCase()}`}
        onPress={() => navigation.navigate("SectionForm", { sectionKey: section.key })}
      />
      <View style={styles.gap} />

      {items.length === 0 ? (
        <Text style={styles.empty}>Nothing here yet. Tap the button above to add one.</Text>
      ) : null}

      {items.map((item) => {
        const subtitle = section.subtitleKey ? item[section.subtitleKey] : null;

        return (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("SectionForm", {
                sectionKey: section.key,
                itemId: item.id,
              })
            }
          >
            <Text style={styles.title}>{String(item[section.titleKey] ?? "")}</Text>
            {typeof subtitle === "string" && subtitle ? (
              <Text style={styles.subtitle}>{subtitle}</Text>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, backgroundColor: colors.background },
  gap: { height: 16 },
  empty: { color: colors.muted, textAlign: "center", marginTop: 24 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { color: colors.muted, marginTop: 2 },
});
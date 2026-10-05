import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { findSection } from "../config/sections";
import { useProfile } from "../context/ProfileContext";
import { buildPayload, FormValues, initialValues } from "../forms/formUtils";
import type { RootStackParamList } from "../navigation/types";
import { ApiError } from "../services/api";
import { createItem, deleteItem, itemsOf, updateItem } from "../services/profile.api";
import { Button, ErrorText, colors } from "../ui/components";
import FieldsForm from "../ui/FieldsForm";

type Props = NativeStackScreenProps<RootStackParamList, "SectionForm">;

export default function SectionFormScreen({ navigation, route }: Props) {
  const { sectionKey, itemId } = route.params;
  const section = findSection(sectionKey);
  const { profile, refresh } = useProfile();

  const existing =
    profile && section && itemId
      ? itemsOf(profile, section.key).find((item) => item.id === itemId)
      : undefined;

  const [values, setValues] = useState<FormValues>(() =>
    initialValues(section?.fields ?? [], existing)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${itemId ? "Edit" : "Add"} ${section?.singular.toLowerCase() ?? ""}`,
    });
  }, [navigation, section, itemId]);

  if (!section) return null;

  const setValue = (key: string, value: string | boolean) =>
    setValues((previous) => ({ ...previous, [key]: value }));

  const save = async () => {
    setError(null);

    const built = buildPayload(section.fields, values);
    if (!built.ok) {
      setError(built.error);
      return;
    }

    setSaving(true);
    try {
      if (itemId) {
        await updateItem(section.key, itemId, built.payload);
      } else {
        await createItem(section.key, built.payload);
      }
      await refresh();
      navigation.goBack();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!itemId) return;
    setSaving(true);
    try {
      await deleteItem(section.key, itemId);
      await refresh();
      navigation.goBack();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong.");
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(`Delete this ${section.singular.toLowerCase()}?`, "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: doDelete },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <FieldsForm fields={section.fields} values={values} onChange={setValue} />
      <ErrorText message={error} />
      <Button title="Save" onPress={save} loading={saving} />

      {itemId ? (
        <View style={styles.deleteWrap}>
          <Button title="Delete" variant="danger" onPress={confirmDelete} disabled={saving} />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, backgroundColor: colors.background },
  deleteWrap: { marginTop: 12 },
});
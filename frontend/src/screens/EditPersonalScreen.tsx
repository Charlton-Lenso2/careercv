import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { PERSONAL_FIELDS } from "../config/sections";
import { useProfile } from "../context/ProfileContext";
import { buildPayload, FormValues, initialValues } from "../forms/formUtils";
import type { RootStackParamList } from "../navigation/types";
import { ApiError } from "../services/api";
import { updateProfile } from "../services/profile.api";
import { Button, ErrorText, colors } from "../ui/components";
import FieldsForm from "../ui/FieldsForm";

type Props = NativeStackScreenProps<RootStackParamList, "EditPersonal">;

export default function EditPersonalScreen({ navigation }: Props) {
  const { profile, refresh } = useProfile();
  const [values, setValues] = useState<FormValues>(() =>
    initialValues(PERSONAL_FIELDS, profile as unknown as Record<string, unknown> | undefined)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setValue = (key: string, value: string | boolean) =>
    setValues((previous) => ({ ...previous, [key]: value }));

  const save = async () => {
    setError(null);

    const built = buildPayload(PERSONAL_FIELDS, values);
    if (!built.ok) {
      setError(built.error);
      return;
    }

    setSaving(true);
    try {
      await updateProfile(built.payload);
      await refresh();
      navigation.goBack();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <FieldsForm fields={PERSONAL_FIELDS} values={values} onChange={setValue} />
      <ErrorText message={error} />
      <Button title="Save" onPress={save} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, backgroundColor: colors.background },
});
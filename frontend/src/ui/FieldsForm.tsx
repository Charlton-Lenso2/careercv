import { StyleSheet, Switch, Text, View } from "react-native";
import { FieldConfig } from "../config/sections";
import { FormValues } from "../forms/formUtils";
import { Field } from "./components";

type Props = {
  fields: FieldConfig[];
  values: FormValues;
  onChange: (key: string, value: string | boolean) => void;
};

export default function FieldsForm({ fields, values, onChange }: Props) {
  return (
    <>
      {fields.map((field) => {
        if (field.type === "boolean") {
          return (
            <View key={field.key} style={styles.switchRow}>
              <Text style={styles.switchLabel}>{field.label}</Text>
              <Switch
                value={Boolean(values[field.key])}
                onValueChange={(next) => onChange(field.key, next)}
              />
            </View>
          );
        }

        const isList = field.type === "list";

        return (
          <Field
            key={field.key}
            label={field.required ? `${field.label} *` : field.label}
            value={String(values[field.key] ?? "")}
            onChangeText={(text) => onChange(field.key, text)}
            multiline={field.type === "multiline" || isList}
            placeholder={
              field.placeholder ??
              (field.type === "date" ? "YYYY-MM-DD" : isList ? "One per line" : undefined)
            }
            keyboardType={
              field.type === "email"
                ? "email-address"
                : field.type === "url"
                  ? "url"
                  : field.keyboard
            }
            autoCapitalize={
              field.type === "email" || field.type === "url" || field.type === "date"
                ? "none"
                : "sentences"
            }
            autoCorrect={field.type === "text" || field.type === "multiline"}
          />
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  switchLabel: { fontWeight: "600" },
});
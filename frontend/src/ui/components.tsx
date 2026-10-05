import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

export const colors = {
  text: "#111827",
  muted: "#6b7280",
  border: "#e5e7eb",
  surface: "#f9fafb",
  primary: "#111827",
  danger: "#dc2626",
  background: "#ffffff",
};

type FieldProps = TextInputProps & { label: string; hint?: string };

export function Field({ label, hint, style, ...inputProps }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#9ca3af"
        style={[styles.input, inputProps.multiline && styles.inputMultiline, style]}
        {...inputProps}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        isSecondary && styles.buttonSecondary,
        variant === "danger" && styles.buttonDanger,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.text : "#ffffff"} />
      ) : (
        <Text style={[styles.buttonText, isSecondary && styles.buttonTextSecondary]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function ErrorText({ message }: { message: string | null }) {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  fieldWrap: { marginBottom: 14 },
  label: { fontWeight: "600", marginBottom: 6, color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  inputMultiline: { minHeight: 96, textAlignVertical: "top" },
  hint: { fontSize: 12, color: colors.muted, marginTop: 4 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  buttonDanger: { backgroundColor: colors.danger },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#ffffff", fontWeight: "600", fontSize: 16 },
  buttonTextSecondary: { color: colors.text },
  error: { color: colors.danger, marginBottom: 12 },
});
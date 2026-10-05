import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { Session } from "@supabase/supabase-js";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ProfileProvider } from "./src/context/ProfileContext";
import { supabase } from "./src/lib/supabase";
import type { RootStackParamList } from "./src/navigation/types";
import AuthScreen from "./src/screens/AuthScreen";
import EditPersonalScreen from "./src/screens/EditPersonalScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SectionFormScreen from "./src/screens/SectionFormScreen";
import SectionListScreen from "./src/screens/SectionListScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      {session ? (
        <ProfileProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: "My career profile" }}
              />
              <Stack.Screen
                name="EditPersonal"
                component={EditPersonalScreen}
                options={{ title: "Personal info" }}
              />
              <Stack.Screen name="SectionList" component={SectionListScreen} />
              <Stack.Screen name="SectionForm" component={SectionFormScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ProfileProvider>
      ) : (
        <AuthScreen />
      )}
      <StatusBar style="auto" />
    </>
  );
}
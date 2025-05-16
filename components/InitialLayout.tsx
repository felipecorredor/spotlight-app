import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

const InitialLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  const segments = useSegments();

  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthScreen = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthScreen) router.replace("/(auth)/login");

    if (isSignedIn && inAuthScreen) router.replace("/(tabs)");
    // eslint-disable-next-line
  }, [isLoaded, isSignedIn, segments]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default InitialLayout;

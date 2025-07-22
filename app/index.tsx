import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useData } from "../context/DataContext";

export default function Index() {
  const { state } = useData();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // S'assurer que tout est monté (évite les navigate early bugs)
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 100); // petit délai pour laisser le layout se monter

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isReady && !state.loading) {
      if (state.user) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/login");
      }
    }
  }, [isReady, state.loading, state.user]);

  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
});

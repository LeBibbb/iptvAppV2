import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import VideoPlayer from "../components/VideoPlayer";

export default function WatchScreen() {
  const { streamUrl, title } = useLocalSearchParams<{
    streamUrl?: string;
    title?: string;
  }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!streamUrl) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Aucun flux vidéo disponible.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {loading && !error && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00FFAA" />
          <Text style={styles.loadingText}>Chargement du flux...</Text>
        </View>
      )}
      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Erreur de lecture du flux.</Text>
        </View>
      )}
      // Même logique que plus haut, sauf :
      <VideoPlayer
        uri={streamUrl}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)} // ✅ Plus fiable que onReadyForDisplay
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 14,
    backgroundColor: "#111",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    flexShrink: 1,
  },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#fff", marginLeft: 5 },
  errorText: { color: "red", fontSize: 18, marginTop: 12 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#888" },
});

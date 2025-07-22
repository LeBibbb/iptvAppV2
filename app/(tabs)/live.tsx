import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useData } from "../../context/DataContext";

export default function LiveScreen() {
  const { state } = useData();
  const { liveStreams } = state;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chaînes Live</Text>
      {/* Ici tu peux ajouter ta liste liveStreams */}
      <Text style={styles.info}>Nombre de chaînes live : {liveStreams.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  title: { fontSize: 24, color: "#fff", marginBottom: 10 },
  info: { color: "#ccc" },
});

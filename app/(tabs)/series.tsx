import React, { useState } from "react";
import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useData } from "../../context/DataContext";

const PAGE_SIZE = 10;

export default function SeriesScreen() {
  const { state } = useData();
  const { seriesStreams } = state;

  const [page, setPage] = useState(1);
  const dataPaginated = seriesStreams.slice(0, page * PAGE_SIZE);

const getImageUri = (item: any) => item.cover || "https://via.placeholder.com/120x180.png?text=Série";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📺 Séries</Text>
      <FlatList
        data={dataPaginated}
        keyExtractor={(item) => item.series_id.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: getImageUri(item) }} style={styles.poster} />
            <Text style={styles.label} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {seriesStreams.length > page * PAGE_SIZE && (
        <Button title="Voir plus" onPress={() => setPage(page + 1)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 16 },
  title: { fontSize: 24, color: "#fff", marginBottom: 12 },
  card: { flex: 1 / 3, margin: 5, alignItems: "center" },
  poster: { width: 100, height: 150, borderRadius: 8 },
  label: { color: "#fff", marginTop: 6, fontSize: 14, textAlign: "center" },
});

// app/home.tsx
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useData } from '../../context/DataContext';

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const { state } = useData();
  const { user, liveStreams, vodStreams, seriesStreams } = state;

  // Pagination simple sur chaque liste
  const [livePage, setLivePage] = useState(1);
  const [vodPage, setVodPage] = useState(1);
  const [seriesPage, setSeriesPage] = useState(1);

  const paginate = (data: any[], page: number) => data.slice(0, page * PAGE_SIZE);

    useEffect(() => {
    console.log("2 premiers liveStreams :", liveStreams.slice(0, 2));
    console.log("2 premiers vodStreams :", vodStreams.slice(0, 2));
    console.log("2 premiers seriesStreams :", seriesStreams.slice(0, 2));
  }, [liveStreams, vodStreams, seriesStreams]);

const getImageUri = (item: any, type: 'live' | 'vod' | 'series') => {
  if (type === 'live') return item.stream_icon || 'https://via.placeholder.com/100x100.png?text=TV';
  if (type === 'vod') return item.stream_icon || 'https://via.placeholder.com/120x180.png?text=Film';
  if (type === 'series') return item.cover || 'https://via.placeholder.com/120x180.png?text=Série';
  return '';
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Bienvenue {user?.username || 'Invité'}</Text>

      {/* Chaînes Live */}
      <Text style={styles.sectionTitle}>📡 Chaînes en direct</Text>
      <FlatList
        horizontal
        data={paginate(liveStreams, livePage)}
        keyExtractor={(item, i) => `live-${i}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: getImageUri(item, 'live') }} style={styles.image} />
            <Text style={styles.label} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
      {liveStreams.length > livePage * PAGE_SIZE && (
        <Button title="Voir plus" onPress={() => setLivePage(livePage + 1)} />
      )}

      {/* Films VOD */}
      <Text style={styles.sectionTitle}>🎬 Films récents</Text>
      <FlatList
        horizontal
        data={paginate(vodStreams, vodPage)}
        keyExtractor={(item) => `vod-${item.stream_id}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: getImageUri(item, 'vod') }} style={styles.poster} />
            <Text style={styles.label} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
      {vodStreams.length > vodPage * PAGE_SIZE && (
        <Button title="Voir plus" onPress={() => setVodPage(vodPage + 1)} />
      )}

      {/* Séries */}
      <Text style={styles.sectionTitle}>📺 Séries populaires</Text>
      <FlatList
        horizontal
        data={paginate(seriesStreams, seriesPage)}
        keyExtractor={(item) => `series-${item.series_id}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: getImageUri(item, 'series') }} style={styles.poster} />
            <Text style={styles.label} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
      {seriesStreams.length > seriesPage * PAGE_SIZE && (
        <Button title="Voir plus" onPress={() => setSeriesPage(seriesPage + 1)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', paddingTop: 40, paddingHorizontal: 16 },
  welcome: { fontSize: 22, color: '#fff', marginBottom: 20 },
  sectionTitle: { fontSize: 18, color: '#fff', marginTop: 25, marginBottom: 10 },
  card: { marginRight: 10, alignItems: 'center', width: 120 },
  image: { width: 100, height: 100, borderRadius: 12 },
  poster: { width: 120, height: 180, borderRadius: 12 },
  label: { color: '#fff', marginTop: 8, fontSize: 14, textAlign: 'center' },
});

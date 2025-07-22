import React, { useState } from 'react';
import { Button, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useData } from '../../context/DataContext';

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const { state } = useData();
  const { user, liveStreams, vodStreams, seriesStreams } = state;

  const [activeTab, setActiveTab] = useState<'live' | 'vod' | 'series'>('live');
  const [livePage, setLivePage] = useState(1);
  const [vodPage, setVodPage] = useState(1);
  const [seriesPage, setSeriesPage] = useState(1);

  const paginate = (data: any[], page: number) => data.slice(0, page * PAGE_SIZE);

  const getImageUri = (item: any, type: 'live' | 'vod' | 'series') => {
    if (type === 'live') return item.stream_icon || 'https://via.placeholder.com/100x100.png?text=TV';
    if (type === 'vod') return item.stream_icon || 'https://via.placeholder.com/120x180.png?text=Film';
    if (type === 'series') return item.cover || 'https://via.placeholder.com/120x180.png?text=Série';
    return '';
  };

  const renderList = (type: 'live' | 'vod' | 'series') => {
    let data = [], page = 1, setPage = () => {}, title = '', keyBase = '', imageStyle = {};

    if (type === 'live') {
      data = liveStreams;
      page = livePage;
      setPage = setLivePage;
      title = '📡 Chaînes en direct';
      keyBase = 'live';
      imageStyle = styles.image;
    } else if (type === 'vod') {
      data = vodStreams;
      page = vodPage;
      setPage = setVodPage;
      title = '🎬 Films récents';
      keyBase = 'vod';
      imageStyle = styles.poster;
    } else if (type === 'series') {
      data = seriesStreams;
      page = seriesPage;
      setPage = setSeriesPage;
      title = '📺 Séries populaires';
      keyBase = 'series';
      imageStyle = styles.poster;
    }

    return (
      <>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          horizontal
          data={paginate(data, page)}
          keyExtractor={(item, i) => `${keyBase}-${item.stream_id || item.series_id || i}`}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <Image source={{ uri: getImageUri(item, type) }} style={imageStyle} />
              <Text style={styles.label} numberOfLines={1}>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
        {data.length > page * PAGE_SIZE && (
          <Button title="Voir plus" onPress={() => setPage(page + 1)} />
        )}
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Bienvenue {user?.username || 'Invité'}</Text>

      {/* Sous-menu */}
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => setActiveTab('live')}>
          <Text style={activeTab === 'live' ? styles.activeTab : styles.tab}>Chaînes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('vod')}>
          <Text style={activeTab === 'vod' ? styles.activeTab : styles.tab}>Films</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('series')}>
          <Text style={activeTab === 'series' ? styles.activeTab : styles.tab}>Séries</Text>
        </TouchableOpacity>
      </View>

      {/* Liste dynamique */}
      {renderList(activeTab)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', paddingTop: 40, paddingHorizontal: 16 },
  welcome: { fontSize: 22, color: '#fff', marginBottom: 20 },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#222',
    paddingVertical: 10,
    borderRadius: 10,
  },
  tab: {
    color: '#aaa',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeTab: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionTitle: { fontSize: 18, color: '#fff', marginTop: 10, marginBottom: 10 },
  card: { marginRight: 10, alignItems: 'center', width: 120 },
  image: { width: 100, height: 100, borderRadius: 12 },
  poster: { width: 120, height: 180, borderRadius: 12 },
  label: { color: '#fff', marginTop: 8, fontSize: 14, textAlign: 'center' },
});

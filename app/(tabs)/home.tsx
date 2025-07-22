import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import CarouselListByCategory from '../../components/home/CarouselListByCategory';
import TabsMenu from '../../components/home/TabsMenu';
import { useData } from '../../context/DataContext';

export default function HomeScreen() {
  const { state } = useData();
  const { user, liveStreams, vodStreams, seriesStreams } = state;

  const [activeTab, setActiveTab] = useState<'live' | 'vod' | 'series'>('live');

  const tabTitles = {
    live: '📡 Chaînes en direct',
    vod: '🎬 Films récents',
    series: '📺 Séries populaires',
  };

  const dataMap = {
    live: liveStreams,
    vod: vodStreams,
    series: seriesStreams,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Bienvenue {user?.username || 'Invité'}</Text>
      <TabsMenu activeTab={activeTab} onChangeTab={setActiveTab} />
      <Text style={styles.sectionTitle}>{tabTitles[activeTab]}</Text>
      <CarouselListByCategory data={dataMap[activeTab]} type={activeTab} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', paddingTop: 40, paddingHorizontal: 16 },
  welcome: { fontSize: 22, color: '#fff', marginBottom: 20 },
  sectionTitle: { fontSize: 18, color: '#fff', marginBottom: 16 },
});

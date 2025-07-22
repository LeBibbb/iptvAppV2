import { useLocalSearchParams, useRouter } from 'expo-router';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';

export default function WatchScreen() {
  const router = useRouter();

 const { streamUrl, title } = useLocalSearchParams();
 console.log(streamUrl)
  if (!streamUrl) {
    console.log(streamUrl)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Aucun flux disponible.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <VideoPlayer uri={streamUrl} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#aaa', paddingTop: 40 },
  title: { color: '#fff', fontSize: 20, marginBottom: 12, textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  errorText: { color: 'red', fontSize: 18 },
});

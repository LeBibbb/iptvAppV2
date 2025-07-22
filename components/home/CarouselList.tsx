import React, { useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PAGE_SIZE = 10;

export default function CarouselList({ data, type }) {
  const [page, setPage] = useState(1);

  const paginate = (data, page) => data.slice(0, page * PAGE_SIZE);

  const getImageUri = (item, type) => {
    if (type === 'live') return item.stream_icon || 'https://via.placeholder.com/100x100.png?text=TV';
    if (type === 'vod') return item.stream_icon || 'https://via.placeholder.com/120x180.png?text=Film';
    if (type === 'series') return item.cover || 'https://via.placeholder.com/120x180.png?text=Série';
    return '';
  };

  const paginatedData = paginate(data, page);

  return (
    <View>
      <FlatList
        horizontal
        data={paginatedData}
        keyExtractor={(item, i) => `${type}-${item.stream_id || item.series_id || i}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: getImageUri(item, type) }} style={type === 'live' ? styles.image : styles.poster} />
            <Text style={styles.label} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
      {data.length > page * PAGE_SIZE && (
        <Button title="Voir plus" onPress={() => setPage(page + 1)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginRight: 10, alignItems: 'center', width: 120 },
  image: { width: 100, height: 100, borderRadius: 12 },
  poster: { width: 120, height: 180, borderRadius: 12 },
  label: { color: '#fff', marginTop: 8, fontSize: 14, textAlign: 'center' },
});

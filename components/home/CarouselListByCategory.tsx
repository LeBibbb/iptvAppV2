import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CarouselList from './CarouselList';

const groupByCategory = (data: any[]) => {
  const grouped = data.reduce((acc, item) => {
    const category = item.category_name || 'Inconnu';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return grouped;
};

export default function CarouselListByCategory({ data, type }: { data: any[], type: string }) {
  const groupedData = groupByCategory(data);

  return (
    <View style={styles.container}>
      {Object.entries(groupedData).map(([category, items]) => (
        <View key={category} style={styles.block}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <CarouselList data={items} type={type} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  block: { marginBottom: 24 },
  categoryTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});

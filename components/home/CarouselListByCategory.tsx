import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { groupByCategory } from '../../utils/groupByCategory';
import CarouselList from './CarouselList';

export default function CarouselListByCategory({ data, type }) {
  const groupedData = groupByCategory(data);

  return (
    <View>
      {Object.entries(groupedData).map(([category, items]) => (
        <View key={category} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <CarouselList data={items} type={type} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabType = 'live' | 'vod' | 'series';

interface TabsMenuProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export default function TabsMenu({ activeTab, onChangeTab }: TabsMenuProps) {
  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity onPress={() => onChangeTab('live')}>
        <Text style={activeTab === 'live' ? styles.activeTab : styles.tab}>Chaînes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChangeTab('vod')}>
        <Text style={activeTab === 'vod' ? styles.activeTab : styles.tab}>Films</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChangeTab('series')}>
        <Text style={activeTab === 'series' ? styles.activeTab : styles.tab}>Séries</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});

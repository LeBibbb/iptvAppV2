import { Video } from 'expo-av';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function VideoPlayer({ uri }) {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={styles.video}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
});

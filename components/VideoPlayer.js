import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function VideoPlayer({ uri, onLoadStart, onLoad, onError }) {
  const videoRef = useRef(null);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showControls) setShowControls(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [showControls]);

  const togglePlayPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleToggleControls = () => {
    setShowControls((prev) => !prev);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <TouchableOpacity
        style={styles.fullscreenTouch}
        activeOpacity={1}
        onPress={handleToggleControls}
      >
        <Video
          ref={videoRef}
          source={{ uri }}
          style={styles.video}
          resizeMode="contain"
          shouldPlay
          isLooping
          useNativeControls={false}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onError={onError}
        />

        {showControls && (
          <>
            {/* Retour */}
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>

            {/* Play/Pause */}
            <View style={styles.controls}>
              <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={72}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  fullscreenTouch: { flex: 1 },
  video: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
  },
  controls: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 8,
  },
});

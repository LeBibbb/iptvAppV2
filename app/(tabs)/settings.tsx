import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useData } from "../../context/DataContext";


export default function SettingsScreen() {
  const [portals, setPortals] = useState([]);
  const { dispatch } = useData();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const savedPortalsStr = await AsyncStorage.getItem("@portals");
      const savedPortals = savedPortalsStr ? JSON.parse(savedPortalsStr) : [];
      setPortals(savedPortals);
    })();
  }, []);

  async function connectPortal(portal: { url: string; username: string; password: string }) {
    try {
      const baseUrl = portal.url.startsWith("http") ? portal.url : `http://${portal.url}`;
      const accountInfoUrl = `${baseUrl}/player_api.php?username=${portal.username}&password=${portal.password}&action=get_account_info`;
      const accountRes = await fetch(accountInfoUrl);
      if (!accountRes.ok) throw new Error("Erreur réseau");
      const accountData = await accountRes.json();

      if (!accountData?.user_info?.status || accountData.user_info.status.toLowerCase() !== "active") {
        Alert.alert("Erreur", "Compte inactif ou identifiants incorrects");
        return;
      }

      dispatch({ type: "SET_USER", payload: accountData.user_info });

      const [liveRes, vodRes, seriesRes] = await Promise.all([
        fetch(`${baseUrl}/player_api.php?username=${portal.username}&password=${portal.password}&action=get_live_streams`),
        fetch(`${baseUrl}/player_api.php?username=${portal.username}&password=${portal.password}&action=get_vod_streams`),
        fetch(`${baseUrl}/player_api.php?username=${portal.username}&password=${portal.password}&action=get_series`)
      ]);

      if (!liveRes.ok || !vodRes.ok || !seriesRes.ok) throw new Error("Erreur lors de la récupération des flux");

      const liveData = await liveRes.json();
      const vodData = await vodRes.json();
      const seriesData = await seriesRes.json();

      dispatch({ type: "SET_LIVE", payload: liveData });
      dispatch({ type: "SET_VOD", payload: vodData });
      dispatch({ type: "SET_SERIES", payload: seriesData });

      router.replace("/(tabs)/home");
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Erreur de connexion");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portails enregistrés</Text>
      <FlatList
        data={portals}
        keyExtractor={(item, index) => `portal-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.portalItem} onPress={() => connectPortal(item)}>
            <Text style={styles.portalText}>{item.url} - {item.username}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: "#ccc", textAlign: "center" }}>Aucun portail enregistré</Text>}
      />
      <Button
        title="Retour à la connexion"
        onPress={() => router.push("/login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#111" },
  title: { fontSize: 22, color: "#fff", marginBottom: 20, textAlign: "center" },
  portalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  portalText: { color: "#fff", fontSize: 16 },
});

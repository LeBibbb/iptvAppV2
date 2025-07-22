import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useData } from "../context/DataContext";

export default function LoginScreen() {
  const router = useRouter();
  const { dispatch } = useData();

  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      // Optionnel : charger dernier portail si tu veux remplir le formulaire
      const portalsStr = await AsyncStorage.getItem("@portals");
      const portals = portalsStr ? JSON.parse(portalsStr) : [];
      if (portals.length > 0) {
        const lastPortal = portals[0];
        setUrl(lastPortal.url);
        setUsername(lastPortal.username);
        setPassword(lastPortal.password);
      }
    })();
  }, []);

  async function savePortalInList(url: string, username: string, password: string) {
    try {
      const savedPortalsStr = await AsyncStorage.getItem("@portals");
      const savedPortals = savedPortalsStr ? JSON.parse(savedPortalsStr) : [];
      const exists = savedPortals.some(
        (p: any) => p.url === url && p.username === username
      );
      if (!exists) {
        savedPortals.unshift({ url, username, password }); // ajouter en début
        await AsyncStorage.setItem("@portals", JSON.stringify(savedPortals));
      }
    } catch (e) {
      // ignore
    }
  }

  async function handleLogin() {
    const cleanedUrl = url.trim();
    const cleanedUsername = username.trim();
    const cleanedPassword = password.trim();

    if (!cleanedUrl || !cleanedUsername || !cleanedPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = cleanedUrl.startsWith("http")
        ? cleanedUrl
        : `http://${cleanedUrl}`;

      const accountInfoUrl = `${baseUrl}/player_api.php?username=${cleanedUsername}&password=${cleanedPassword}&action=get_account_info`;
      const accountRes = await fetch(accountInfoUrl);
      if (!accountRes.ok) throw new Error("Erreur réseau");
      const accountData = await accountRes.json();

      if (
        !accountData?.user_info?.status ||
        accountData.user_info.status.toLowerCase() !== "active"
      ) {
        Alert.alert("Erreur", "Compte inactif ou identifiants incorrects");
        setLoading(false);
        return;
      }

      dispatch({ type: "SET_USER", payload: accountData.user_info });

      const [liveRes, vodRes, seriesRes] = await Promise.all([
        fetch(
          `${baseUrl}/player_api.php?username=${cleanedUsername}&password=${cleanedPassword}&action=get_live_streams`
        ),
        fetch(
          `${baseUrl}/player_api.php?username=${cleanedUsername}&password=${cleanedPassword}&action=get_vod_streams`
        ),
        fetch(
          `${baseUrl}/player_api.php?username=${cleanedUsername}&password=${cleanedPassword}&action=get_series`
        ),
      ]);

      if (!liveRes.ok || !vodRes.ok || !seriesRes.ok)
        throw new Error("Erreur lors de la récupération des flux");

      const liveData = await liveRes.json();
      const vodData = await vodRes.json();
      const seriesData = await seriesRes.json();

      dispatch({ type: "SET_LIVE", payload: liveData });
      dispatch({ type: "SET_VOD", payload: vodData });
      dispatch({ type: "SET_SERIES", payload: seriesData });

      await savePortalInList(cleanedUrl, cleanedUsername, cleanedPassword);

      router.replace("/(tabs)/home");
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion Xtream</Text>
      <TextInput
        placeholder="URL du portail"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        keyboardType="url"
        style={styles.input}
      />
      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        title={loading ? "Connexion..." : "Se connecter"}
        onPress={handleLogin}
        disabled={loading}
      />
      <Button
        title="Portails enregistrés"
        onPress={() => router.push("/settings")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#222",
  },
  title: { fontSize: 24, marginBottom: 30, color: "#fff", textAlign: "center" },
  input: {
    height: 50,
    borderColor: "#555",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 5,
    color: "#fff",
    backgroundColor: "#333",
  },
});

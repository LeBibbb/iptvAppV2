// app/login.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useData } from "../context/DataContext";

export default function LoginScreen() {
  const router = useRouter();
  const { dispatch } = useData();

  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      await AsyncStorage.setItem("portal_url", cleanedUrl);
      await AsyncStorage.setItem("portal_username", cleanedUsername);
      await AsyncStorage.setItem("portal_password", cleanedPassword);
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

      console.log("Live:", liveRes, "VOD:", vodRes, "Series:", seriesRes);

      if (!liveRes.ok || !vodRes.ok || !seriesRes.ok)
        throw new Error("Erreur lors de la récupération des flux");

      const liveData = await liveRes.json();
      const vodData = await vodRes.json();
      const seriesData = await seriesRes.json();

      dispatch({ type: "SET_LIVE", payload: liveData });
      dispatch({ type: "SET_VOD", payload: vodData });
      dispatch({ type: "SET_SERIES", payload: seriesData });

      router.replace("/home");
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

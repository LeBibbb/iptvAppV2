// app/index.tsx
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Bienvenue 👋</Text>
      <Link href="/login">Aller à la page de connexion</Link>
      <Link href="/home">Aller à la page de home</Link>
    </View>
  );
}

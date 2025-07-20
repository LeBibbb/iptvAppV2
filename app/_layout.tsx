import { Stack } from "expo-router";
import React from "react";
import { DataProvider } from "../context/DataContext";

export default function RootLayout() {
  return (
    <DataProvider>
      <Stack />
    </DataProvider>
  );
}

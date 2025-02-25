import React from "react";
import { Link, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function CarsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="cars"
        options={{
          title: "Cars",
          headerRight: () => (
            <Link href="/(cars)/add" asChild>
              <TouchableOpacity>
                <FontAwesome6 name="add" size={24} color="black" />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="add" options={{ title: "New Car" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Car" }} />
    </Stack>
  );
}

import { CarsProvider } from "@/context/cars.context";
import { ServerProvider } from "@/context/server.context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ServerProvider>
      <CarsProvider>
        <Stack>
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          <Stack.Screen name="(cars)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </CarsProvider>
    </ServerProvider>
  );
}

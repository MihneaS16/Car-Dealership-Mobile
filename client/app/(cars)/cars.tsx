import { StyleSheet, FlatList, Button, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CarItem from "@/components/CarItem";
import { Link } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CarsContext } from "@/context/cars.context";
import { ServerContext } from "@/context/server.context";
import { Snackbar } from "react-native-paper";

export default function CarList() {
  const { cars } = useContext(CarsContext);
  const { serverUp } = useContext(ServerContext);
  const [visible, setVisible] = useState<boolean>(!serverUp);
  const onDismissSnackbar = () => setVisible(false);

  useEffect(() => {
    if (serverUp) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [serverUp]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.carsScreen}>
        <Link href="/(cars)/add" asChild>
          <Button title="Add" />
        </Link>
        <FlatList
          data={cars}
          keyExtractor={(car) => car._id}
          renderItem={({ item }) => <CarItem car={item} />}
          contentContainerStyle={styles.list}
        />
        <Snackbar visible={visible} onDismiss={onDismissSnackbar}>
          The server is down
        </Snackbar>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  list: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  carsScreen: {
    flex: 1,
  },
});

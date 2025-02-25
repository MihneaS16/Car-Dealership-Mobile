import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { Car } from "@/interfaces/car.interfaces";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { CarsContext } from "@/context/cars.context";

type CarItemProps = {
  car: Car;
};

export default function CarItem({ car }: CarItemProps) {
  const { deleteCar } = useContext(CarsContext);
  const [imageError, setImageError] = useState<boolean>(false);
  const formatPrice = useCallback((price: number): string => {
    const formattedPrice: string = price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedPrice;
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.imgAndInfoContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              imageError || !car.imageUrl
                ? require("../assets/images/no-image-available.png")
                : { uri: car.imageUrl }
            }
            onLoadStart={() => (
              <ActivityIndicator size="small" color="#0000ff" />
            )}
            onError={() => setImageError(true)}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.makeText}>{car.make}</Text>
          <Text style={styles.modelText}>{car.model}</Text>
          <Text style={styles.yearText}>{car.manufactureYear}</Text>
        </View>
      </View>

      <View style={styles.priceAndIconsContainer}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Delete Car",
                "Are you sure you want to delete this car?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteCar(car._id),
                  },
                ],
              )
            }
          >
            <AntDesign name="delete" size={24} color="black" />
          </TouchableOpacity>
          <Link
            href={{ pathname: "/(cars)/edit/[id]", params: { id: car._id } }}
            asChild
          >
            <TouchableOpacity>
              <Feather name="edit" size={24} color="black" />
            </TouchableOpacity>
          </Link>
        </View>
        <View>
          <Text style={styles.priceText}>{formatPrice(car.price)}€</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 150,
    width: 350,
    backgroundColor: "#ffffff",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 15,
    margin: 10,
    //shadow
    shadowColor: "#0c0c0c",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    //display
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  imgAndInfoContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
  infoContainer: {
    marginTop: 10,
  },
  image: {
    height: 125,
    width: 160,
    borderRadius: 15,
  },
  priceAndIconsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 10,
    width: 65,
  },
  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  makeText: {
    color: "#0d1b34",
    fontWeight: "500",
    fontSize: 16,
  },
  modelText: {
    color: "#7c7c7c",
    fontSize: 12,
  },
  yearText: {
    color: "#7c7c7c",
    fontSize: 12,
  },
  priceText: {
    color: "#0d1b34",
    fontWeight: "500",
  },
});

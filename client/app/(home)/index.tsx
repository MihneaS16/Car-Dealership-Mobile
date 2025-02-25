import { Link } from "expo-router";
import { Button, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Link href="/(cars)/cars" asChild>
        <Button title="View available cars" />
      </Link>
    </View>
  );
}

import {
  CarAddEditFormValues,
  CarFormSchema,
} from "../../types/CarAddEditFormValues.types";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useContext } from "react";
import { CarsContext } from "@/context/cars.context";
import { router } from "expo-router";

export default function AddCar() {
  const { addCar } = useContext(CarsContext);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CarAddEditFormValues>({
    resolver: zodResolver(CarFormSchema),
  });

  const handleAddCar: SubmitHandler<CarAddEditFormValues> = async (data) => {
    await addCar(data);
    router.replace("/(cars)/cars");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formFieldsContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Make</Text>
            <Controller
              control={control}
              name="make"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.make ? { borderColor: "red", borderWidth: 1 } : {},
                  ]}
                  placeholder="e.g. BMW"
                  placeholderTextColor="#888"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.make && (
              <Text style={styles.errorText}>{errors.make.message}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Model</Text>
            <Controller
              control={control}
              name="model"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.model ? { borderColor: "red", borderWidth: 1 } : {},
                  ]}
                  placeholder="e.g. M3"
                  placeholderTextColor="#888"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.model && (
              <Text style={styles.errorText}>{errors.model.message}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Year</Text>
            <Controller
              control={control}
              name="manufactureYear"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.manufactureYear
                      ? { borderColor: "red", borderWidth: 1 }
                      : {},
                  ]}
                  keyboardType="numeric"
                  placeholder="e.g. 2024"
                  placeholderTextColor="#888"
                  onChangeText={(text) => onChange(Number(text) || "")}
                  onBlur={onBlur}
                  value={value ? value.toString() : ""}
                />
              )}
            />
            {errors.manufactureYear && (
              <Text style={styles.errorText}>
                {errors.manufactureYear.message}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Price</Text>
            <View style={styles.priceContainer}>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.price
                        ? { borderColor: "red", borderWidth: 1 }
                        : {},
                    ]}
                    keyboardType="numeric"
                    placeholder="€"
                    placeholderTextColor="#888"
                    onChangeText={(text) => onChange(Number(text) || "")}
                    onBlur={onBlur}
                    value={value ? value.toString() : ""}
                  />
                )}
              />
              {errors.price && (
                <Text style={styles.errorText}>{errors.price.message}</Text>
              )}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Image Url</Text>
            <Controller
              control={control}
              name="imageUrl"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.imageUrl
                      ? { borderColor: "red", borderWidth: 1 }
                      : {},
                  ]}
                  placeholder="https://"
                  placeholderTextColor="#888"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value || ""}
                />
              )}
            />
            {errors.imageUrl && (
              <Text style={styles.errorText}>{errors.imageUrl.message}</Text>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(handleAddCar)}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Loading..." : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    height: "100%",
    display: "flex",
    justifyContent: "space-evenly",
  },
  formFieldsContainer: {
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
  },
  formGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0d1b34",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#000",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
    color: "#0d1b34",
  },
  priceInput: {
    flex: 1,
  },
  button: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#0d1b34",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 10,
  },
});

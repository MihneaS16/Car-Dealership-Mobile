import { ServerContext } from "@/context/server.context";
import useLocalDbService from "@/data/db";
import { Car } from "@/interfaces/car.interfaces";
import useCarService from "@/services/car.service";
import { useCallback, useContext } from "react";

export default function useAddCar() {
  const { create: createApi } = useCarService();
  const { getDBConnection, add, addLog } = useLocalDbService();
  const { serverUp } = useContext(ServerContext);

  const addCar = useCallback(
    async (addCarData: Omit<Car, "_id">): Promise<Car | undefined> => {
      try {
        const db = await getDBConnection();
        if (serverUp) {
          const addedCar = await createApi(addCarData);
          await add(db, addCarData, addedCar._id);
          return addedCar;
        } else {
          const addedCar = await add(db, addCarData);
          await addLog(db, {
            operation: "create",
            carId: addedCar._id,
          });
          return addedCar;
        }
      } catch (err) {
        console.error("Error adding car ", err);
      }
    },
    [createApi, getDBConnection, add, addLog, serverUp],
  );

  return { addCar };
}

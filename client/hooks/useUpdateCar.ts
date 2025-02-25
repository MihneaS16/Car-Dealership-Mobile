import { ServerContext } from "@/context/server.context";
import useLocalDbService from "@/data/db";
import { Car } from "@/interfaces/car.interfaces";
import useCarService from "@/services/car.service";
import { useCallback, useContext } from "react";

export default function useUpdateCar() {
  const { update: updateApi } = useCarService();
  const { getDBConnection, update, addLog } = useLocalDbService();
  const { serverUp } = useContext(ServerContext);

  const updateCar = useCallback(
    async (
      id: string,
      updateCarData: Omit<Car, "_id">,
    ): Promise<Car | undefined> => {
      try {
        const db = await getDBConnection();
        if (serverUp) {
          const updatedCar = await updateApi(id, updateCarData);
          await update(db, id, updateCarData);
          return updatedCar;
        } else {
          const updatedCar = await update(db, id, updateCarData);
          await addLog(db, {
            operation: "update",
            carId: updatedCar._id,
          });
          return updatedCar;
        }
      } catch (err) {
        console.error("Error updating car ", err);
      }
    },
    [updateApi, getDBConnection, update, addLog, serverUp],
  );

  return { updateCar };
}

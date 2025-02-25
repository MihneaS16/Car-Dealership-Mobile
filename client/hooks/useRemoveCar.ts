import { ServerContext } from "@/context/server.context";
import useLocalDbService from "@/data/db";
import useCarService from "@/services/car.service";
import { useCallback, useContext } from "react";

export default function useRemoveCar() {
  const { remove: removeApi } = useCarService();
  const { getDBConnection, remove, getById, addLog } = useLocalDbService();
  const { serverUp } = useContext(ServerContext);

  const removeCar = useCallback(
    async (id: string): Promise<void> => {
      try {
        const db = await getDBConnection();
        if (serverUp) {
          await removeApi(id);
          await remove(db, id);
        } else {
          const carToBeRemoved = await getById(db, id);
          if (carToBeRemoved) {
            await remove(db, id);
            await addLog(db, {
              operation: "remove",
              carId: carToBeRemoved._id,
            });
          }
        }
      } catch (err) {
        console.error("Error removing car ", err);
      }
    },
    [removeApi, getDBConnection, remove, getById, addLog, serverUp],
  );

  return { removeCar };
}

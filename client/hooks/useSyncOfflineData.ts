import useLocalDbService from "@/data/db";
import { Car } from "@/interfaces/car.interfaces";
import { Log } from "@/interfaces/log.interface";
import useCarService from "@/services/car.service";
import { useCallback } from "react";

export default function useSyncOfflineData() {
  const { create, update, remove } = useCarService();
  const {
    getDBConnection,
    getById,
    replaceCarIdWithTheBackendOne,
    getAllUnsyncedLogs,
    getAllUnsyncedLogsOfCar,
    setLogSynced,
  } = useLocalDbService();

  const syncDataWithServer = useCallback(async () => {
    try {
      const db = await getDBConnection();
      const allUnsyncedLogs: Log[] = await getAllUnsyncedLogs(db);

      const uniqueModifiedCarIds: string[] = Array.from(
        new Set(allUnsyncedLogs.map((log) => log.carId)),
      );

      await Promise.all(
        uniqueModifiedCarIds.map(async (id) => {
          const allUnsyncedLogsOfCar: Log[] = await getAllUnsyncedLogsOfCar(
            db,
            id,
          );

          if (allUnsyncedLogsOfCar.length === 1) {
            if (allUnsyncedLogsOfCar[0].operation === "create") {
              const carData: Car | null = await getById(db, id);
              if (carData) {
                const createdCar: Car = await create({
                  make: carData.make,
                  model: carData.model,
                  manufactureYear: carData.manufactureYear,
                  price: carData.price,
                  imageUrl: carData.imageUrl,
                });

                await replaceCarIdWithTheBackendOne(db, id, createdCar._id);
                await setLogSynced(db, allUnsyncedLogsOfCar[0]._id);
              }
            } else if (allUnsyncedLogsOfCar[0].operation === "update") {
              const carData: Car | null = await getById(db, id);
              if (carData) {
                await update(id, {
                  make: carData.make,
                  model: carData.model,
                  manufactureYear: carData.manufactureYear,
                  price: carData.price,
                  imageUrl: carData.imageUrl,
                });

                await setLogSynced(db, allUnsyncedLogsOfCar[0]._id);
              }
            } else if (allUnsyncedLogsOfCar[0].operation === "remove") {
              await remove(id);
              await setLogSynced(db, allUnsyncedLogsOfCar[0]._id);
            }
          } else {
            const operationsPerformed: string[] = allUnsyncedLogsOfCar.map(
              (log) => log.operation,
            );
            if (
              operationsPerformed.includes("create") &&
              operationsPerformed.includes("remove")
            ) {
              await Promise.all(
                allUnsyncedLogsOfCar.map((log) => setLogSynced(db, log._id)),
              );
            } else if (
              operationsPerformed.includes("update") &&
              operationsPerformed.includes("remove")
            ) {
              await remove(id);
              await Promise.all(
                allUnsyncedLogsOfCar.map((log) => setLogSynced(db, log._id)),
              );
            } else if (
              operationsPerformed.includes("create") &&
              operationsPerformed.includes("update")
            ) {
              const carData: Car | null = await getById(db, id);
              if (carData) {
                const createdCar: Car = await create({
                  make: carData.make,
                  model: carData.model,
                  manufactureYear: carData.manufactureYear,
                  price: carData.price,
                  imageUrl: carData.imageUrl,
                });

                await replaceCarIdWithTheBackendOne(db, id, createdCar._id);
                await Promise.all(
                  allUnsyncedLogsOfCar.map((log) => setLogSynced(db, log._id)),
                );
              }
            } else {
              const carData: Car | null = await getById(db, id);
              if (carData) {
                await update(id, {
                  make: carData.make,
                  model: carData.model,
                  manufactureYear: carData.manufactureYear,
                  price: carData.price,
                  imageUrl: carData.imageUrl,
                });
                await Promise.all(
                  allUnsyncedLogsOfCar.map((log) => setLogSynced(db, log._id)),
                );
              }
            }
          }
        }),
      );
    } catch (err) {
      console.error("There has been an error syncing the server", err);
    }
  }, [
    getDBConnection,
    getAllUnsyncedLogs,
    getAllUnsyncedLogsOfCar,
    setLogSynced,
    getById,
    create,
    update,
    remove,
    replaceCarIdWithTheBackendOne,
  ]);

  return { syncDataWithServer };
}

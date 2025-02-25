import { ServerContext } from "@/context/server.context";
import useLocalDbService from "@/data/db";
import { Car } from "@/interfaces/car.interfaces";
import useCarService from "@/services/car.service";
import { useCallback, useContext } from "react";

export default function useFetchCars() {
  const { getAll: getAllApi } = useCarService();
  const { getDBConnection, getAll } = useLocalDbService();
  const { serverUp } = useContext(ServerContext);

  const fetchAllCars = useCallback(async (): Promise<Car[] | undefined> => {
    try {
      if (serverUp) {
        const allCars = await getAllApi();
        return allCars;
      } else {
        const db = await getDBConnection();
        const allCars = await getAll(db);
        return allCars;
      }
    } catch (err) {
      console.error("Error fetching cars ", err);
    }
  }, [getDBConnection, getAll, getAllApi, serverUp]);

  return { fetchAllCars };
}

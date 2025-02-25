import { Car } from "@/interfaces/car.interfaces";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useLocalDbService from "@/data/db";
import useFetchCars from "@/hooks/useFetchCars";
import useAddCar from "@/hooks/useAddCar";
import useUpdateCar from "@/hooks/useUpdateCar";
import useRemoveCar from "@/hooks/useRemoveCar";
import useSyncOfflineData from "@/hooks/useSyncOfflineData";
import { ServerContext } from "./server.context";

interface ICarsContext {
  cars: Car[];
  setCars: (cars: Car[]) => void;
  addCar: (car: Omit<Car, "_id">) => void;
  updateCar: (id: string, car: Omit<Car, "_id">) => void;
  deleteCar: (id: string) => void;
}

interface CarsProviderProps {
  children: ReactNode;
}

export const CarsContext = createContext<ICarsContext>({} as ICarsContext);

export function CarsProvider({ children }: CarsProviderProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const { getDBConnection, initDb } = useLocalDbService();
  const { fetchAllCars } = useFetchCars();
  const { addCar: add } = useAddCar();
  const { updateCar: update } = useUpdateCar();
  const { removeCar: remove } = useRemoveCar();
  const { syncDataWithServer } = useSyncOfflineData();
  const { serverUp } = useContext(ServerContext);

  useEffect(() => {
    const loadData = async () => {
      const db = await getDBConnection();
      await initDb(db);
      if (serverUp) {
        await syncDataWithServer();
      }
      const allCars = await fetchAllCars();
      if (allCars) {
        setCars(allCars);
      }
    };

    loadData();
  }, [getDBConnection, initDb, fetchAllCars, syncDataWithServer, serverUp]);

  const addCar = useCallback(
    async (addCarData: Omit<Car, "_id">) => {
      const addedCar: Car | undefined = await add(addCarData);
      if (addedCar) {
        setCars([...cars, addedCar]);
      }
    },
    [cars, add],
  );

  const updateCar = useCallback(
    async (id: string, updateCarData: Omit<Car, "_id">) => {
      const updatedCar: Car | undefined = await update(id, updateCarData);
      if (updatedCar) {
        setCars((prevCars) =>
          prevCars.map((car) =>
            car._id === id ? { ...car, ...updatedCar } : car,
          ),
        );
      }
    },
    [update],
  );

  const deleteCar = useCallback(
    async (id: string) => {
      await remove(id);
      setCars((prevCars) => prevCars.filter((car) => car._id !== id));
    },
    [remove],
  );

  const value = useMemo(
    () => ({ cars, setCars, addCar, updateCar, deleteCar }),
    [cars, setCars, addCar, updateCar, deleteCar],
  );

  return <CarsContext.Provider value={value}>{children}</CarsContext.Provider>;
}

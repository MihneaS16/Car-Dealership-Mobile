import { CARS_NGROK_BASE_URL } from "@/config/api-config";
import { Car } from "@/interfaces/car.interfaces";
import axios from "axios";
import { useCallback } from "react";

export default function useCarService() {
  const getAll = useCallback(async (): Promise<Car[]> => {
    try {
      const response = await axios.get(`${CARS_NGROK_BASE_URL}`);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const getById = useCallback(async (id: string): Promise<Car> => {
    try {
      const response = await axios.get(`${CARS_NGROK_BASE_URL}/${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const create = useCallback(
    async (carData: Omit<Car, "_id">): Promise<Car> => {
      try {
        const response = await axios.post(`${CARS_NGROK_BASE_URL}`, carData);
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    [],
  );

  const update = useCallback(
    async (id: string, carData: Omit<Car, "_id">): Promise<Car> => {
      try {
        const response = await axios.put(
          `${CARS_NGROK_BASE_URL}/${id}`,
          carData,
        );
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    [],
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      await axios.delete(`${CARS_NGROK_BASE_URL}/${id}`);
    } catch (err) {
      throw err;
    }
  }, []);

  return { getAll, getById, create, update, remove };
}

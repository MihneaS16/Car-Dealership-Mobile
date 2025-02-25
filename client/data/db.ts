import { Car } from "@/interfaces/car.interfaces";
import { Log } from "@/interfaces/log.interface";
import * as SQLite from "expo-sqlite";
import { useCallback } from "react";
import "react-native-get-random-values"; // this is needed for the uuid for some reason
import { v4 as uuidv4 } from "uuid";

export default function useLocalDbService() {
  const tableName = "Cars";

  const getDBConnection = useCallback(async () => {
    const db = await SQLite.openDatabaseAsync("car-dealership");
    console.log("connection opened");
    return db;
  }, []);

  const initDb = useCallback(async (db: SQLite.SQLiteDatabase) => {
    const query1 = `CREATE TABLE IF NOT EXISTS ${tableName} (
      _id TEXT PRIMARY KEY NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      manufactureYear INTEGER NOT NULL,
      price REAL NOT NULL,
      imageUrl TEXT
    );`;

    const query2 =
      "CREATE TABLE IF NOT EXISTS Operations_Logs (_id TEXT PRIMARY KEY NOT NULL, operation TEXT NOT NULL, carId TEXT NOT NULL, date TEXT NOT NULL, synced INTEGER DEFAULT 0); ";

    await db.runAsync(query1);
    await db.runAsync(query2);
    console.log("database initialised");
  }, []);

  const getAll = useCallback(
    async (db: SQLite.SQLiteDatabase): Promise<Car[]> => {
      const query = `SELECT * FROM ${tableName}`;
      return await db.getAllAsync(query);
    },
    [],
  );

  const getById = useCallback(
    async (db: SQLite.SQLiteDatabase, id: string): Promise<Car | null> => {
      const query = `SELECT * FROM ${tableName} WHERE _id = ?`;
      return await db.getFirstAsync(query, [id]);
    },
    [],
  );

  const add = useCallback(
    async (
      db: SQLite.SQLiteDatabase,
      addCarData: Omit<Car, "_id">,
      id?: string,
    ): Promise<Car> => {
      if (!id) {
        id = uuidv4();
      }
      const query = `INSERT INTO ${tableName} (_id, make, model, manufactureYear, price, imageUrl) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
      await db.runAsync(query, [
        id,
        addCarData.make,
        addCarData.model,
        addCarData.manufactureYear,
        addCarData.price,
        addCarData.imageUrl || "",
      ]);
      return { ...addCarData, _id: id };
    },
    [],
  );

  const update = useCallback(
    async (
      db: SQLite.SQLiteDatabase,
      id: string,
      updateCarData: Omit<Car, "_id">,
    ): Promise<Car> => {
      const query = `UPDATE ${tableName} 
      SET make = ?, 
          model = ?, 
          manufactureYear = ?, 
          price = ?, 
          imageUrl = ?
      WHERE _id = ?;`;

      await db.runAsync(query, [
        updateCarData.make,
        updateCarData.model,
        updateCarData.manufactureYear,
        updateCarData.price,
        updateCarData.imageUrl || "",
        id,
      ]);

      return { ...updateCarData, _id: id };
    },
    [],
  );

  const remove = useCallback(
    async (db: SQLite.SQLiteDatabase, id: string): Promise<void> => {
      const query = `DELETE FROM ${tableName} WHERE _id = ?`;
      await db.runAsync(query, [id]);
    },
    [],
  );

  const replaceCarIdWithTheBackendOne = useCallback(
    async (
      db: SQLite.SQLiteDatabase,
      oldId: string,
      newId: string,
    ): Promise<void> => {
      await db.withTransactionAsync(async () => {
        const oldCarQuery = `SELECT * FROM ${tableName} WHERE _id = ?`;
        const oldCar: Car | null = await db.getFirstAsync(oldCarQuery, [oldId]);

        if (!oldCar) {
          throw new Error(`Car with id ${oldId} not found`);
        }

        const insertQuery = `INSERT INTO ${tableName} (_id, make, model, manufactureYear, price, imageUrl) 
                           VALUES (?, ?, ?, ?, ?, ?)`;
        await db.runAsync(insertQuery, [
          newId,
          oldCar.make,
          oldCar.model,
          oldCar.manufactureYear,
          oldCar.price,
          oldCar.imageUrl || "",
        ]);

        const deleteQuery = `DELETE FROM ${tableName} WHERE _id = ?`;
        await db.runAsync(deleteQuery, [oldId]);
      });
    },
    [],
  );

  const getAllLogs = useCallback(
    async (db: SQLite.SQLiteDatabase): Promise<Log[]> => {
      const query = "SELECT * FROM Operations_Logs";
      return await db.getAllAsync(query);
    },
    [],
  );

  const getAllUnsyncedLogs = useCallback(
    async (db: SQLite.SQLiteDatabase): Promise<Log[]> => {
      const query = "SELECT * FROM Operations_Logs WHERE synced = 0";
      return await db.getAllAsync(query);
    },
    [],
  );

  const getAllUnsyncedLogsOfCar = useCallback(
    async (db: SQLite.SQLiteDatabase, carId: string): Promise<Log[]> => {
      const query =
        "SELECT * FROM Operations_Logs WHERE synced = 0 AND carId = ?";
      return await db.getAllAsync(query, [carId]);
    },
    [],
  );

  const addLog = useCallback(
    async (
      db: SQLite.SQLiteDatabase,
      logData: Omit<Log, "_id" | "synced" | "date">,
    ): Promise<void> => {
      const query =
        "INSERT INTO Operations_Logs (_id, operation, carId, date, synced) VALUES (?, ?, ?, ?, ?)";
      const id = uuidv4();
      const currentDate = new Date().toISOString();
      await db.runAsync(query, [
        id,
        logData.operation,
        logData.carId,
        currentDate,
        0,
      ]);
    },
    [],
  );

  const setLogSynced = useCallback(
    async (db: SQLite.SQLiteDatabase, id: string): Promise<void> => {
      const query = "UPDATE Operations_Logs SET synced = 1 WHERE _id = ?";
      await db.runAsync(query, [id]);
    },
    [],
  );

  const dropTable = useCallback(
    async (db: SQLite.SQLiteDatabase, table: string) => {
      const query = `DROP TABLE ${table}`;
      await db.runAsync(query);
    },
    [],
  );

  return {
    getDBConnection,
    initDb,
    getAll,
    getById,
    add,
    update,
    remove,
    replaceCarIdWithTheBackendOne,
    dropTable,
    getAllLogs,
    getAllUnsyncedLogs,
    getAllUnsyncedLogsOfCar,
    addLog,
    setLogSynced,
  };
}

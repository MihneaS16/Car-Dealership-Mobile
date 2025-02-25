import { NGROK_BASE_URL } from "@/config/api-config";
import axios, { AxiosResponse } from "axios";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

interface IServerContext {
  serverUp: boolean;
}

interface ServerProviderProps {
  children: ReactNode;
}

export const ServerContext = createContext<IServerContext>(
  {} as IServerContext,
);

export function ServerProvider({ children }: ServerProviderProps) {
  const [serverUp, setServerUp] = useState<boolean>(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response: AxiosResponse = await axios.get(NGROK_BASE_URL);
        if (response.status === 200) {
          setServerUp(true);
        } else {
          setServerUp(false);
        }
      } catch (err) {
        console.error("The backend is down", err);
        setServerUp(false);
      }
    };

    checkServerStatus();
    const interval = setInterval(() => {
      checkServerStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const value = useMemo(() => ({ serverUp }), [serverUp]);

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
}

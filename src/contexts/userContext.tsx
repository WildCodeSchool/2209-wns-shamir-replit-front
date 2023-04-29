import React, { createContext, useState, useMemo, ReactNode } from "react";
import { IUser } from "../interfaces/IUser";

const initUser: IUser = {
  id: 0,
  email: "",
  login: "",
  date_start_subscription: null,
  date_end_subscription: null,
};

type UserContextProviderProps = { children: ReactNode };
type TypeContext = {
  user: IUser;
  setUser: (c: IUser) => void;
};

const UserContext = createContext<TypeContext>({
  user: initUser,
  setUser: () => {
    console.warn("setUser has not been implemented");
  },
});

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<IUser>(initUser);
  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;

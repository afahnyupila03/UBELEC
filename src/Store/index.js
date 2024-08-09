import { useContext } from "react";
import { Context, Provider } from "./context";

export const AppContext = ({ children }) => {
  return <Provider>{children}</Provider>;
};

export const AppState = () => useContext(Context);

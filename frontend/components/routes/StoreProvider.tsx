"use client";
import { Provider } from "react-redux";
import { store, persistor } from "@/lib/store/index";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Toaster } from "../ui/toaster";

function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
      <Toaster />
    </Provider>
  );
}

export default StoreProvider;

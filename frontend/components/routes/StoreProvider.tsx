"use client";
import { Provider } from "react-redux";
import { store, persistor } from "@/lib/store/index";
import { PersistGate } from "redux-persist/lib/integration/react";

function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
}

export default StoreProvider;

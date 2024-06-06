"use client";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainWrapper from "@/components/MainWrapper";
import ToastManager from "@/components/ToastManager";
import ModalManager from "@/components/ModalManager";
import { store, persistor } from "@/store";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.min.css";
import "primeicons/primeicons.css";

const Template = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Header
          withoutAuthorization={
            pathname.includes("/registration") ||
            pathname.includes("/login") ||
            pathname.includes("/restore")
          }
        />
        <MainWrapper>{children}</MainWrapper>
        <Footer />
        <ToastManager />
        <ModalManager />
      </PersistGate>
    </Provider>
  );
};

export default Template;

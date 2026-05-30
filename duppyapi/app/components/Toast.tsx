import React from "react";
import { Toaster } from "react-hot-toast";

export const ToastProvider: React.FC = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: "#111",
        color: "#fff",
      },
    }}
  />
);

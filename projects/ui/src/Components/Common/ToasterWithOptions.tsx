import { Toaster } from "react-hot-toast";

export const ToasterWithOptions = () => (
  <Toaster
    toastOptions={{
      duration: 3000,
      position: "bottom-right",
    }}
  />
);

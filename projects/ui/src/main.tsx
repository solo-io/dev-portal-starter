import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./Components/App";
import "./Styles/main.scss";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "*",
          element: <App />,
        },
      ])}
    />
  </QueryClientProvider>
);

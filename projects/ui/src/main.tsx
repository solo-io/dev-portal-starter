import "@stoplight/elements/styles.min.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./Styles/main.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: "*",
        element: <App />,
      },
    ])}
  />
);

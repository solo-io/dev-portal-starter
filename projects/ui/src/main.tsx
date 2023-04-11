import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { App } from "./Components/App";
import { ToasterWithOptions } from "./Components/Common/ToasterWithOptions";
import "./Styles/main.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <ToasterWithOptions />
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "*",
          element: <App />,
        },
      ])}
    />
  </>
);

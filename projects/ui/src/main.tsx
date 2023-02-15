import "@stoplight/elements/styles.min.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./Components/App";
import { store } from "./redux/store";
import "./Styles/main.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "*",
          element: <App />,
        },
      ])}
    />
  </Provider>
);

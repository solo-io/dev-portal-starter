import { Route, Routes } from "react-router-dom";
import ApiDetails from "./Components/ApiDetails/ApiDetails";
import Apis from "./Components/Apis/Apis";
import Home from "./Components/Home/Home";
import UsagePlans from "./Components/UsagePlans/UsagePlans";

function AppContentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/apis" element={<Apis />} />
      <Route path="/api-details/:apiId" element={<ApiDetails />} />
      <Route path="/usage-plans" element={<UsagePlans />} />
      <Route path="/usage-plans/:apiId" element={<UsagePlans />} />
    </Routes>
  );
}

export default AppContentRoutes;

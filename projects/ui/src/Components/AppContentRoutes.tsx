import { Route, Routes } from "react-router-dom";
import ApiDetails from "./ApiDetails/ApiDetails";
import Apis from "./Apis/Apis";
import Home from "./Home/Home";
import UsagePlans from "./UsagePlans/UsagePlans";

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

import { Route, Routes } from "react-router-dom";
import { ApiDetails } from "./ApiDetails/ApiDetails";
import { Apis } from "./ApisList/Apis";
import { HomePage } from "./Home/HomePage";
import { Footer } from "./Structure/Footer";
import { UsagePlans } from "./UsagePlans/UsagePlans";

function AppContentRoutes() {
  return (
    <div className="MainContentContainer">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apis" element={<Apis />} />
        <Route path="/api-details/:apiId" element={<ApiDetails />} />
        <Route path="/usage-plans" element={<UsagePlans />} />
        <Route path="/usage-plans/:apiId" element={<UsagePlans />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default AppContentRoutes;

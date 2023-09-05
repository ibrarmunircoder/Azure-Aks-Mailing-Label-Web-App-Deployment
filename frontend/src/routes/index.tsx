import { Routes as Router, Route } from "react-router-dom";
import { CreateNewAddress } from "views/create-new-address/CreateNewAddress";

export const Routes = () => {
  return (
    <Router>
      <Route path="/" element={<CreateNewAddress />} />
      {/* catch all */}
      <Route path="*" element={<p>Missing Route</p>} />
    </Router>
  );
};

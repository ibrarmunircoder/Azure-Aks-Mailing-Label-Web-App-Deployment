import { AuthRedirect, RequireAuth } from "components";
import { Routes as Router, Route } from "react-router-dom";
import { Addresses, CreateUser, Home } from "views";
import { Users } from "views/users/Users";

export const Routes = () => {
  return (
    <Router>
      {/* public routes */}
      <Route element={<AuthRedirect />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Private routes */}
      <Route element={<RequireAuth />}>
        <Route path="addresses" element={<Addresses />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* catch all */}
      <Route path="*" element={<p>Missing Route</p>} />
    </Router>
  );
};

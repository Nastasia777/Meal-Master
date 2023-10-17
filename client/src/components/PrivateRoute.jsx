import { useContext } from "react";
import { Navigate, Route } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "../contexts/authcontext";

const PrivateRoute = ({ path, element: Component, ...rest }) => {
  const { token } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      path={path}
      element={token ? Component : <Navigate to="/login" replace />}
    />
  );
};

PrivateRoute.propTypes = {
  path: PropTypes.string.isRequired,
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;

import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import {
  useSelector,
} from 'react-redux';

export const ProtectedRoute = ({
  allowedRoles,
}) => {
  const location =
    useLocation();

  const {
    user,
    isAuthenticated,
    isCheckingAuth,
  } = useSelector(
    (state) =>
      state.auth
  );

  if (isCheckingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            `${location.pathname}${location.search}`,
        }}
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(
      user?.role
    )
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
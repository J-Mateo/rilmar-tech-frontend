import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import {
  useSelector,
} from 'react-redux';

const GuestRoute = () => {
  const location =
    useLocation();

  const {
    isAuthenticated,
    isCheckingAuth,
  } = useSelector(
    (state) =>
      state.auth
  );

  if (isCheckingAuth) {
    return null;
  }

  if (isAuthenticated) {
    const requestedPath =
      location.state?.from;

    const destination =
      typeof requestedPath ===
        'string' &&
      requestedPath.startsWith('/') &&
      !requestedPath.startsWith('//')
        ? requestedPath
        : '/products';

    return (
      <Navigate
        to={destination}
        replace
      />
    );
  }

  return <Outlet />;
};

export default GuestRoute;
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestRoute = () => {
  const { isAuthenticated, isCheckingAuth } = useSelector(
    (state) => state.auth
  );

  if (isCheckingAuth) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
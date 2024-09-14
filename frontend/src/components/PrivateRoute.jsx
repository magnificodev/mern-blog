import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    const isSignedIn = currentUser !== null;
    return isSignedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;

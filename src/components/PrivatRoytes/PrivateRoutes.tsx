import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
    // const token = localStorage.getItem("authToken");
    return (
        // token ? <Outlet /> : <Navigate to={'/auth'} />
        <Outlet />
    );


}

export default PrivateRoutes

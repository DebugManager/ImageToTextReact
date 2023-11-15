import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import ReactGa from 'react-ga';

ReactGa.initialize('G-898SHVFZE2');

const PrivateRoutes = () => {
    const token = localStorage.getItem("authToken");
    const location = useLocation();

    useEffect(() => {
      ReactGa.pageview(window.location.pathname + window.location.search);
    }, [location]);
    return (
        token ? <Outlet /> : <Navigate to={'/auth'} />
    );


}

export default PrivateRoutes

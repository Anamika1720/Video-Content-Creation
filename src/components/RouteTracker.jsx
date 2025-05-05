import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastRoute", location.pathname);
  }, [location]);

  return null;
};

export default RouteTracker;

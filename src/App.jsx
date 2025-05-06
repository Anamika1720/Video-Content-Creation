import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebaseConfig";
import ProtectedRoute from "./components/PortectedRoutes";
import RouteTracker from "./components/RouteTracker";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoIdeaGenerator from "./pages/VideoIdeas/VideoIdeas.Layout";
import OtpLogin from "./pages/Login/Login.Layout";
import Dashboard from "./pages/Dashboard/Dashboard.Layout";
import WorkHistory from "./pages/WorkHistory/WorkHistory.Layout";
import VideoUploadPage from "./pages/VideoUpload/VideoUploadPage";
import SocialMediaPublisher from "./pages/VideoUpload/SocialMediaPublisher";

const App = () => {
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const isLoggedIn = true;
    const lastRoute = localStorage.getItem("lastRoute");

    if (isLoggedIn && lastRoute && window.location.pathname === "/") {
      // navigate(lastRoute);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <Router>
        <RouteTracker />
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <OtpLogin />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <WorkHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/video-idea"
            element={
              <ProtectedRoute>
                <VideoIdeaGenerator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <VideoUploadPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/youtube-description"
            element={
              <ProtectedRoute>
                <SocialMediaPublisher />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

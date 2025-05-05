import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebaseConfig";
import OtpLogin from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/PortectedRoutes";
import VideoUploadPage from "./components/VideoUplaod/VideoUploadPage";
import SocialMediaPublisher from "./components/VideoUplaod/SocialMediaPublisher";
import ContentDashboard from "./pages/Dashboard/ContentDashboard";
import VideoIdeaGenerator from "./components/VideoIdeaGenerator/VideoIdeaGenerator";
import RouteTracker from "./components/RouteTracker";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const isLoggedIn = true;
    const lastRoute = localStorage.getItem("lastRoute");

    if (isLoggedIn && lastRoute && window.location.pathname === "/") {
      navigate(lastRoute);
    }
  }, []);

  return (
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
          path="/content-dashboard"
          element={
            <ProtectedRoute>
              <ContentDashboard />
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
  );
};

export default App;

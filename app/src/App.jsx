import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ParticlesComponent from "./particles.jsx";
import Navbar from "./containers/navbar/index.jsx";
import Welcome from "./containers/welcome/index.jsx";
import Analyzer from "./containers/analyzer/index.jsx";
import About from "./containers/about/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./App.scss";
function App() {
  const location = useLocation();
  const renderParticles = location.pathname === "/";

  return (
    <AuthContextProvider>
      <div className="App">
        {/* Particles effect on the homepage */}
        {renderParticles && <ParticlesComponent id="particles" />}

        {/* Navbar */}
        <Navbar />

        {/* Main page content */}
        <div className="App_main-page-content">
          <Routes>
            <Route index path="/" element={<Welcome />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/analyzer"
              element={
                <ProtectedRoute>
                  <Analyzer />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthContextProvider>
  );
}

export default App;

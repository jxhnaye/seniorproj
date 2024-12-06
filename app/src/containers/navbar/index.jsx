import React, { useState } from "react";
import logo from "../../img/ffalogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import "./styles.scss";

const Navbar = () => {
  const [toggleIcon, setToggleIcon] = useState(false);
  const { user, logOut } = UserAuth(); // Access user and logOut from context
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // Navigate after logout

  const handleToggleIcon = () => {
    setToggleIcon(!toggleIcon);
  };

  const handleLogOut = async () => {
    try {
      await logOut(); // Log out the user
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Failed to log out:", error.message);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar_container">
          {/* Logo */}
            <img
              src={logo}
              alt="App Logo"
              style={{ height: "80px", width: "auto" }}
            />
          {/* Centered Title */}
          <div className="navbar_center">
            {location.pathname !== "/" && (
              <h1 className="navbar_center_title">RocketMetrics</h1>
            )}
          </div>
          {/* Menu */}
          <ul className={`navbar_container_menu ${toggleIcon ? "active" : ""}`}>
            {/* Render HOME and ANALYZER links */}
            {location.pathname !== "/" && (
              <>
                <li className="navbar_container_menu_item">
                  <Link to="/about" className="navbar_container_menu_item_links">
                    ABOUT
                  </Link>
                </li>
                {user && (
                  <li className="navbar_container_menu_item">
                    <Link
                      className="navbar_container_menu_item_links"
                      to="/analyzer"
                    >
                      ANALYZER
                    </Link>
                  </li>
                )}
              </>
            )}
            {/* Render LOG OUT only if user is logged in and not on the home page */}
            {user && location.pathname !== "/" && (
              <li className="navbar_container_menu_item">
                <Link
                  to="/"
                  className="navbar_container_menu_item_links"
                  onClick={handleLogOut}
                >
                  LOG OUT
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

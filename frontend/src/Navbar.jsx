import React from "react";
import { NavLink } from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">

            {/* Logo */}
            <div className="logo-section">
                <h1 className="logo">QuickeR</h1>
                <span className="logo-subtitle">
                    Offline QR File Transfer
                </span>
            </div>

            {/* Navigation */}
            <div className="nav-buttons">

                <NavLink
                    to="/sender"
                    className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    📤 <span>Sender</span>
                </NavLink>

                <NavLink
                    to="/receiver"
                    className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    📥 <span>Receiver</span>
                </NavLink>

            </div>

        </nav>
    );
};

export default Navbar;
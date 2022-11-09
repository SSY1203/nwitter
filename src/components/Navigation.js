import React from "react";
import { Link } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
const Navigation = ({ userObj }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObj.displayName}님의 Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

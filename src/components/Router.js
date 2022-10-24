import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ userObj, isLogggedIn }) => {
  return (
    <Router>
      {isLogggedIn && <Navigation />}
      <Routes>
        {isLogggedIn ? (
          <>
            <Route exact path="/" element={<Home userObj={userObj} />} />
            <Route
              exact
              path="/profile"
              element={<Profile userObj={userObj} />}
            />
          </>
        ) : (
          <>
            <Route exact path="/" element={<Auth />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;

//<></> 이건 Fragment인데 많은 요소들을 render하고 싶을 때 사용함

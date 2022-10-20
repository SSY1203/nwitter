import React from "react";
import { authService } from "fBase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigator = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigator("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;

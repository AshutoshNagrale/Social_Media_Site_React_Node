import React from "react";
import "./online.css"
export default function Online({ user }) {
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const profileNoUserImage = publicFolder + "person/noAvatar.png";

  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img
          src={publicFolder + user.profilePicture || profileNoUserImage}
          alt={publicFolder + user.profilePicture}
          className="rightbarProfileImg"
        />
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
}

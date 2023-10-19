import { Link } from "react-router-dom";
import React from "react";
import "./closeFriend.css";

export default function CloseFriend({ user }) {
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;

  return (
    <Link
      to={"/profile/" + user.username}
      style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
    >
      <li className="leftbarFriend">
        <img
          src={
            user.profilePicture
              ? user.profilePicture
              : publicFolder + "person/noAvatar.png"
          }
          alt={publicFolder + user.profilePicture}
          className="leftbarFriendImg"
        />
        <span className="leftbarFreindName">{user.username}</span>
      </li>
    </Link>
  );
}

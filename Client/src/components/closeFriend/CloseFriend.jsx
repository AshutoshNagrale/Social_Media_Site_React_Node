import React from "react";
import "./closeFriend.css";

export default function CloseFriend({ user }) {
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;

  return (
    <li className="leftbarFriend">
      <img
        src={publicFolder + user.profilePicture}
        alt={publicFolder + user.profilePicture}
        className="leftbarFriendImg"
      />
      <span className="leftbarFreindName">{user.username}</span>
    </li>
  );
}

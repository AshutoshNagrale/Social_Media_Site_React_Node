import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./topbar.css";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/register");
    window.location.reload();
  };

  const handleTimeline = async () => {
    navigate("/");
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to={user ? "/" : ""} style={{ textDecoration: "none" }}>
          <span className="logo">SocialMediaSite</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <SearchIcon className="searchIcon" />
          <input placeholder="Search" className="searchInput" />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">HomePage</span>
          <span className="topbarLink" onClick={handleTimeline}>
            TimeLine
          </span>
          <span className="topbarLink" onClick={logoutHandler}>
            LOGOUT
          </span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItems">
            <AccountCircleIcon />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItems">
            <ChatIcon />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItems">
            <NotificationsActiveOutlinedIcon />
            <span className="topbarIconBadge">3</span>
          </div>
        </div>
      </div>
      <Link to={`http://127.0.0.1:5173/profile/${user?.username}`}>
        <img
          src={
            user.profilePicture
              ? user.profilePicture
              : publicFolder + "person/noAvatar.png"
          }
          alt={
            user.profilePicture
              ? user.profilePicture
              : publicFolder + "person/noAvatar.png"
          }
          className="topbarImage"
        />
      </Link>
    </div>
  );
}

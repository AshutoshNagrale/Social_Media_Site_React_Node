import React, { useState, useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/righrbar/Rightbar";
import Topbar from "../../components/topbar/topbar";
import axios from "axios";
import "./profile.css";
import { useParams } from "react-router";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";


export default function Profile() {
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const profileNoCoverImage = publicFolder + "person/noCover.png";
  const profileNoUserImage = publicFolder + "person/noAvatar.png";
  const [user, setUser] = useState({});
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `http://localhost:4400/api/user?username=${username}`
      );
      setUser(res.data);
    };

    fetchUser();
  }, [username]);
  return (
    <>
      <Topbar />
      <div className="profile">
        <Leftbar />
        <div className="profileContainer">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={user.coverPicture || profileNoCoverImage}
                alt={user.coverPicture || profileNoCoverImage}
                className="profileCoverImage"
              />
              <img
                src={user.profilePicture || profileNoUserImage}
                alt={user.profilePicture || profileNoUserImage}
                className="profileUserImage"
              />
              <div className="profileMoreOption">
                <MoreHorizIcon fontSize="medium"/>
              </div>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}

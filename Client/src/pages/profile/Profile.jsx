import "./profile.css";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/righrbar/Rightbar";
import Topbar from "../../components/topbar/topbar";
import { useParams } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createPortal } from "react-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ProfileChangeModal from "../../components/profileChangeModal/ProfileChangeModal";

export default function Profile() {
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const profileNoCoverImage = publicFolder + "person/noCover.png";
  const profileNoUserImage = publicFolder + "person/noAvatar.png";
  const [user, setUser] = useState({});
  const username = useParams().username;
  const { user: currentUser } = useContext(AuthContext);
  const [profileModal, setProfileModal] = useState(false);

  //fetch user data
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
              {user.username === currentUser.username && (
                <>
                  <div
                    className="profileMoreOption"
                    onClick={() => setProfileModal(true)}
                  >
                    <MoreHorizIcon fontSize="medium" />
                  </div>
                  {profileModal &&
                    createPortal(
                      <ProfileChangeModal
                        open={profileModal}
                        onClose={(e) => {
                          e.preventDefault();
                          setProfileModal(false);
                        }}
                        setProfileModal={setProfileModal}
                      />,
                      document.getElementById("profileModal")
                    )}
                </>
              )}
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

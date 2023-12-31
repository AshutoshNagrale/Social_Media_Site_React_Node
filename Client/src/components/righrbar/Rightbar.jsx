import "./rightbar.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Users } from "../../dummydata";
import Online from "../online/Online";
import axios from "axios";
import { Link } from "react-router-dom";
const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;

export default function Rightbar({ user }) {
  const birthdayPng = "assets/gift.png";
  const adPng = "assets/ad.png";
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState({});
  const [followed, setFollowed] = useState(false);

  //get Logged user Data
  useEffect(() => {
    const getUserData = async () => {
      if (currentUser._id !== user?._id) {
        const res = await axios.get(
          `http://localhost:4400/api/user?username=${currentUser.username}`
        );
        setProfileUser(res.data);
      }
      setFollowed(profileUser?.followings?.includes(user?._id));
    };
    getUserData();
  }, [user?._id]);

  //Get users friends
  useEffect(() => {
    const getFriends = async () => {
      if (user?._id) {
        try {
          const onlineUser = await axios.get(
            "http://localhost:4400/api/user/friends/" + user._id
          );
          setFriends(onlineUser.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getFriends();
  }, [user]);

  //handle Edit Button
  const handleEditDetails = () => {
    console.log("Edit Clicked");
  };

  // handle Follow Button
  const followHandler = async () => {
    try {
      if (followed) {
        await axios.put(
          `http://localhost:4400/api/user/${user?._id}/unfollow`,
          {
            userId: currentUser._id,
          }
        );
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`http://localhost:4400/api/user/${user?._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (error) {
      console.log(error);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src={birthdayPng} alt="birthday" className="birthdayImg" />
          <span className="birthdayText">
            <b>Ashutosh Nagrale</b> and <b>3 others freinds</b> have a birthday
            Today
          </span>
        </div>
        <img src={adPng} alt="Ad" className="righbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightBarFollowingButton" onClick={followHandler}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <RemoveIcon /> : <AddIcon />}
          </button>
        )}
        <div className="rightbarTitleBox">
          <h4 className="rightbarTitle">User Info</h4>
          {user.username === currentUser.username && (
            <button
              className="rightbarEditButton"
              onClick={() => handleEditDetails()}
            >
              Edit Details
            </button>
          )}
        </div>
        <hr className="rightbarUserDetailsHr" />
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City : </span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From : </span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship : </span>
            <span className="rightbarInfoValue">
              {user.relationship === "1"
                ? "Single"
                : user.relationship === "2"
                ? "Married"
                : ""}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">{user.username}'s Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? friend.profilePicture
                      : publicFolder + "person/noAvatar.png"
                  }
                  alt={
                    friend.profilePicture
                      ? friend.profilePicture
                      : publicFolder + "person/noAvatar.png"
                  }
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="righbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

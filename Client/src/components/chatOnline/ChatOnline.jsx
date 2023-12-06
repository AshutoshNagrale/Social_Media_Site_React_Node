import { useEffect, useState } from "react";
import axios from "axios";
import "./chatOnline.css";

function ChatOnline({ onlineUsers, currentId, setCurrentChat, currentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(url + "/user/friends/" + currentId);
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers?.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        url + "/conversation/find/" + currentId + "/" + user._id
      );
      setCurrentChat(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chatOnline">
      <h2>Online Friends</h2>
      {onlineFriends.map((o, i) => (
        <div
          key={i}
          className="chatOnlineFriends"
          onClick={() => handleClick(o)}
        >
          <div className="chatImgContainer">
            <img
              className="chatOnlineImg"
              src={o?.profilePicture || "./moti.jpg"}
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}

export default ChatOnline;

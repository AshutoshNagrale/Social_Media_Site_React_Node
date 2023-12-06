import "./message.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import axios from "axios";

function Message({ message, own, currentUser, currentChat }) {
  const [user, setUser] = useState();
  const url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const friendId = currentChat.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios.get(url + "/user?userId=" + friendId);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, currentChat]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src={
            own
              ? user?.profilePicture || "./assets/person/noAvatar.png"
              : "./assets/person/noAvatar.png"
          }
          alt=""
          className="messageImg"
        />
        <p className="messageText">{message?.text}</p>
      </div>
      <div className="messageBottom">{format(message?.createdAt)}</div>
    </div>
  );
}

export default Message;

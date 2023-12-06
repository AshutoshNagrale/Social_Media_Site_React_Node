import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState();
  const url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios.get(url + "/user?userId=" + friendId);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img src={user?.profilePicture} alt="" className="conversationImg" />
      <span className="coversationName">{user?.username}</span>
    </div>
  );
};

export default Conversation;

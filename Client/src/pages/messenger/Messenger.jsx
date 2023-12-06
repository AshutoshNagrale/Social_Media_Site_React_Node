import "./messenger.css";
import axios from "axios";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../../components/topbar/topbar";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import Conversation from "../../components/conversation/Conversation";
import { io } from "socket.io-client";

export default function Messenger() {
  const { user } = useContext(AuthContext);
  const socket = useRef();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const url = import.meta.env.VITE_SERVER_URL;
  const scrollRef = useRef();

  //socket connection
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  //new Messages
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  //addUser and getUsers
  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  //get all conversations with all users
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`${url}/conversation/` + user._id);
        setConversations(res.data);
      } catch (error) {
        res.status(500).json("Unable to get Conversations");
      }
    };
    getConversations();
  }, [user._id]);

  //get messages if user click
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(url + "/message/" + currentChat?._id);
        setMessages(res.data);
      } catch (error) {
        res.status(500).json("Unable to get Messages");
      }
    };
    getMessages();
  }, [currentChat]);

  //scroll behavior
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //send button
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(url + "/message", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              className="chatMenuInput"
              placeholder="Search For Friends"
            />
            {conversations.map((c, index) => (
              <div key={index} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m, i) => (
                    <div key={i} ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === user._id}
                        currentUser={user}
                        currentChat={currentChat}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatTextarea"
                    placeholder="Type a message"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noChatOpen">Open a Chat</span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
              currentChat={currentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}

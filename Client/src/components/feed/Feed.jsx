import "./feed.css";
import React, { useState, useEffect, useContext } from "react";
import Share from "../shared/Shared";
import Post from "../post/Post";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [safe, setSafe] = useState(false);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  //Fetch User Timeline
  useEffect(() => {
    const fetchPost = async () => {
      const res = username
        ? await axios.get("http://localhost:4400/api/post/profile/" + username)
        : await axios.get(
            "http://localhost:4400/api/post/timeline/" + user._id
          );

      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };

    fetchPost();
  }, [username, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} safe={safe} />
        ))}
      </div>
    </div>
  );
}

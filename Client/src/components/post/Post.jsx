import "./post.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import React, { useState, useEffect, useContext, useRef } from "react";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { dummyPhotos } from "../../dummydata";

export default function Post({ post, safe }) {
  const heartImage = "heart.png";
  const likeImage = "like.png";
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;

  const [like, setlike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState("");
  const moreOptionMenu = ["Edit", "Delete"];
  const [showOption, setShowOption] = useState(false);
  const menuRef = useRef();
  const optionRef = useRef();

  //Event Listener to Open and Close More Option
  window.addEventListener("click", (event) => {
    if (event.target !== menuRef.current) {
      setShowOption(false);
    }
  });

  // handle More option menu
  const handleMoreOptionClicked = (option) => {
    console.log(option + "clicked");
  };

  //Get Random Image From Internet
  const getRandomImages = () => {
    const randInt = Math.floor(Math.random() * 999);
    return `https://source.unsplash.com/random/800x800/?featured?img=${randInt}`;
  };

  //Set Likes
  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  //Get preSigned Url of Image from S3
  useEffect(() => {
    const getImageFromS3 = async () => {
      if (!post.image) {
        return;
      }
      if (post?.image?.includes("https:")) {
        setImageUrl(post.image);
      } else {
        const bucketname = import.meta.env.VITE_BUCKET_NAME;
        const bucketregion = import.meta.env.VITE_BUCKET_REGION;
        const accesskeys = import.meta.env.VITE_ACCESS_KEYS;
        const secretaccesskeys = import.meta.env.VITE_SECRET_ACCESS_KEYS;

        const s3 = new S3Client({
          credentials: {
            accessKeyId: accesskeys,
            secretAccessKey: secretaccesskeys,
          },
          region: bucketregion,
        });

        const getObjectParams = {
          Bucket: bucketname,
          Key: post?.image,
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 60 });
        setImageUrl(url);
      }
    };

    getImageFromS3();
  }, []);

  //Handel Likes
  const likeHandler = () => {
    try {
      axios.put("http://localhost:4400/api/post/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (error) {}
    setlike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  //Fetch Post Data
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `http://localhost:4400/api/user?userId=${post.userId}`
      );
      setUser(res.data);
    };

    fetchUser();
  }, [post.userId]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
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
                className="postImage"
              />
            </Link>
            <span className="postUserName">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVertIcon
              ref={menuRef}
              onClick={() => setShowOption(!showOption)}
            />
          </div>
          {showOption && (
            <div className="moreOptionBox">
              {moreOptionMenu.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setShowOption(false);
                    handleMoreOptionClicked(option);
                  }}
                >
                  <div ref={optionRef} className="moreOptionText">
                    {option}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img src={getRandomImages()} alt={""} className="postCenterImage" />
          {/* usee imageUrl to use images form s3 
            or use (dummyPhotos[Math.floor(Math.random() * dummyPhotos.length)] to use dummyIMages 
            or use "https://loremflickr.com/320/240" to get random images*/}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              src={publicFolder + likeImage}
              alt="like"
              className="postBottomIcon"
              onClick={() => likeHandler}
            />
            <img
              src={publicFolder + heartImage}
              alt="heart"
              className="postBottomIcon"
              onClick={() => likeHandler}
            />
            <span className="postLikeCounter">{like} People Like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postComments">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

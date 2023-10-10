import "./shared.css";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CancelIcon from "@mui/icons-material/Cancel";
import LabelIcon from "@mui/icons-material/Label";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Shared({ safeClicked }) {
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.image = fileName;
      try {
        await axios.post("http://localhost:4400/api/upload", data);
      } catch (err) {
        console.log(err);
      }
    }
    console.log(newPost);
    try {
      await axios.post("http://localhost:4400/api/post/", newPost);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
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
            className="shareInputImage"
          />
          <input
            placeholder={"whats in your mind " + user.username + " ?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img
              src={URL.createObjectURL(file)}
              alt="shareImg"
              className="shareImg"
            />
            <CancelIcon
              className="shareCancelImg"
              fontSize="large"
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOptionItem">
              <PhotoLibraryIcon htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo / Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOptionItem">
              <LabelIcon htmlColor="DodgerBlue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOptionItem">
              <LocationOnIcon
                htmlColor="MediumSeaGreen"
                className="shareIcon"
              />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOptionItem">
              <EmojiEmotionsIcon htmlColor="#FFC300" className="shareIcon" />
              <span className="shareOptionText">Emojis</span>
            </div>
            <div className="shareOptionItem">
              <span className="shareOptionTextSafe">Emojis</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}

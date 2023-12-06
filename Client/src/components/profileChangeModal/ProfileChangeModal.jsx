import "./profileChangeModal.css";
import { AuthContext } from "../../context/AuthContext";
import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ProfileChangeModal({ open, onClose, setProfileModal }) {
  if (!open) return null;

  const { user: currentUser } = useContext(AuthContext);
  const [profileChangeFile, setProfileChangeFile] = useState();
  const [option, setOption] = useState(null);
  const [optionSelected, setOptionSelected] = useState(null);
  const overlayRef = useRef();
  const [errorNoFile, setErrorNoFile] = useState();

  //handle submit picture change
  const handleChangeProfilePicture = async (e) => {
    e.preventDefault();
    if (!profileChangeFile) {
      setErrorNoFile("Please Select Picture");
      return;
    }
    console.log("clicked to upload");
    if (profileChangeFile) {
      setErrorNoFile(null);
      const data = new FormData();
      const fileName = Date.now() + profileChangeFile.name;
      data.append("name", fileName);
      data.append("file", profileChangeFile);
      try {
        await axios.post("http://localhost:4400/api/upload", data);
        console.log("photo uploaded to s3");
      } catch (err) {
        console.log(err);
      }

      try {
        console.log();
        await axios.put(`http://localhost:4400/api/user/${currentUser._id}`, {
          userId: currentUser._id,
          option: fileName,
        });
        console.log("data updated in mongodb");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div
        ref={overlayRef}
        onClick={(e) => {
          setProfileModal(false);
        }}
        className="overlay"
      ></div>
      <div className="profileChangeModal">
        {profileChangeFile && (
          <div className="ProfileImgChangeContainer">
            <img
              src={URL.createObjectURL(profileChangeFile)}
              alt="profileImageChange"
              className="ProfileImgChange"
            />
            <CancelIcon
              className="profileCancelImg"
              fontSize="large"
              onClick={() => setProfileChangeFile(null)}
            />
          </div>
        )}
        <form onSubmit={handleChangeProfilePicture}>
          <div>What you want to change ?</div>
          <div className="radioButtonsBox">
            <input
              className="radioButtons"
              type="radio"
              id="profile"
              name="profile"
              value={"profilePicture"}
              onChange={(e) => {
                setOptionSelected(true);
                setOption(e.target.value);
              }}
            />
            <label
              className={
                option === "profilePicture"
                  ? "radioButtonLabel radioButtonLabelSelected"
                  : "radioButtonLabel"
              }
              htmlFor="profile"
            >
              Profile
            </label>
            <input
              className="radioButtons"
              type="radio"
              id="cover"
              name="profile"
              value={"coverPicture"}
              onChange={(e) => {
                setOptionSelected(true);
                setOption(e.target.value);
              }}
            />
            <label
              className={
                option === "coverPicture"
                  ? "radioButtonLabel radioButtonLabelSelected"
                  : "radioButtonLabel"
              }
              htmlFor="cover"
            >
              Cover
            </label>
          </div>
          <input
            type="file"
            onChange={(e) => {
              setProfileChangeFile(e.target.files[0]);
            }}
          />
          {errorNoFile && <h4 style={{ color: "red" }}>Please Select File</h4>}
          {optionSelected === null ? (
            <h4 style={{ color: "red" }}>
              Please Select What you want to change
            </h4>
          ) : (
            ""
          )}
          <div className="profileChangeButtons">
            <button>Upload</button>
            <button
              className="cancelButton"
              onClick={(e) => onClose(e)}
              style={{ "--clr": "#FF44CC" }}
            >
              <span>Cancel</span>
              <i></i>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

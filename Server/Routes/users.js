const express = require("express");
const bycrypt = require("bcrypt");
const User = require("../Models/User");
const router = express.Router();

//UPDATE USER
router.put("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bycrypt.genSalt(10);
        req.body.password = await bycrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("You CAn onlu update your Account !.");
  }
});

//DELETE USER
router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Your Account has been Deleted Successfully.");
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    return res.status(400).json("You Cannot Delete others Accoutn");
  }
});

//GET USER
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET FREINDS
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendsList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendsList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendsList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//FOLLOW USER
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentuser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentuser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed by currentuser");
      } else {
        res.status(403).json("ALready Following");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Cannot follow yourself");
  }
});

//UNFOLLOW USER
router.put("/:id/unfollow", async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        const currentuser = await User.findById(req.body.userId);
        if (user?.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentuser.updateOne({ $pull: { followings: req.params.id } });
          return res.status(200).json("User Has been Unfollowed");
        } else {
          res.status(403).json("You are not follwinf the user");
        }
      } else {
        res.status(403).json("User NOT fuond");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("CAnnot Unfollow Yourelf");
  }
});
module.exports = router;

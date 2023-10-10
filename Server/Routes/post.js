const Post = require("../Models/Post");
const User = require("../Models/User");
const express = require("express");
const router = express.Router();
const multer = require("multer");

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (err) {
    res.status(400).json(err);
  }
  console.log(req.body);
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post has been Updated");
    } else {
      res.status(403).json("You can only update your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post has been DEleted");
    } else {
      res.status(403).json("You can only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// LIKES/DISLIKE POST
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("POst has been lIkes 😊😊");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("POst has been DISlIkes 😭😭");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POST

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(403).json(err);
  }
});

// GET TIMELINE
router.get("/timeline/:userId", async (req, res) => {
  try {
    const curretnUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: curretnUser._id });
    const friendPosts = await Promise.all(
      curretnUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    const allPosts = userPosts.concat(...friendPosts);
    return res.status(200).json(allPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USERS ALL POSTS
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

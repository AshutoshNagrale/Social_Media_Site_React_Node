const router = require("express").Router();
const ConversationModel = require("../Models/Conversation");

//NEW CONVERSATION
router.post("/", async (req, res) => {
  const newConversation = new ConversationModel({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(400).json(error);
  }
});

//GET CONVERSATION ON USER
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await ConversationModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(400).json(error);
  }
});

//GET CONVERSATION INCLUDES TWO USERID
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await ConversationModel.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

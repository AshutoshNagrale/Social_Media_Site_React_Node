const mongoose = require("mongoose");

const ConversationsSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const ConversationModel = mongoose.model("Conversation", ConversationsSchema);
module.exports = ConversationModel;

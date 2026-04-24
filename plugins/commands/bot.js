const axios = require("axios");

module.exports = {
  config: {
    name: "bot",
    aliases: ["sim"],
    prefix: "both",
    permission: 0,
    description: "AI Chat using handleReply (Page Bot)"
  },

  start: async function ({ senderId, args, nayan, event }) {
    const usermsg = args.join(" ").trim();


    if (!usermsg) {
      const greetings = [
        "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
        "কি গো সোনা আমাকে ডাকছ কেনো",
        "বার বার আমাকে ডাকস কেন😡",
        "আহ শোনা আমার আমাকে এতো ডাকতাছো কেনো আসো বুকে আশো🥱",
        "হুম জান তোমার অইখানে উম্মমাহ😷😘",
        "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
        "আমাকে এতো না ডেকে বস নয়নকে একটা গফ দে 🙄"
      ];

      const randomMessage =
        greetings[Math.floor(Math.random() * greetings.length)];

      const sentInfo = await nayan.sendMessage(senderId, { text: randomMessage }, { replyTo: event.message.text });
      

      
      global.client.handleReply.push({
        name: this.config.name,
        messageID: sentInfo.message_id,
        author: senderId,
        type: "chat",
        head: randomMessage
      });

      return;
    }

    
    try {
      const apis = await axios.get(
        "https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json"
      );
      const apiurl = apis.data.api;

      const response = await axios.get(
        `${apiurl}/sim?type=ask&ask=${encodeURIComponent(usermsg)}`
      );

      const replyText = response.data.data?.msg || "🤖 I don't understand.";

      const sentInfo = await nayan.sendMessage(senderId, { text: replyText }, { replyTo: event.message.text });

      console.log(sentInfo)

      
      global.client.handleReply.push({
        name: this.config.name,
        messageID: sentInfo.message_id,
        author: senderId,
        type: "chat",
        head: usermsg
      });

    } catch (err) {
      console.log("❌ Bot error:", err.message);
      nayan.sendMessage(senderId, { text: "❌ Bot API not responding." });
    }
  },

  handleReply: async function ({ senderId, text, replyTo, nayan, event }) {
    
    
    if (!replyTo || senderId !== replyTo.author) return;

    try {
      const apis = await axios.get(
        "https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json"
      );
      const apiurl = apis.data.api;

      const response = await axios.get(
        `${apiurl}/sim?type=ask&ask=${encodeURIComponent(text)}`
      );

      const replyText = response.data.data?.msg || "🤖 I don't understand.";

      const sentInfo = await nayan.sendMessage(senderId, { text: replyText }, { replyTo: event.message.text });

      
      global.client.handleReply.push({
        name: this.config.name,
        messageID: sentInfo.message_id,
        author: senderId,
        type: "chat",
        head: text
      });

    } catch (err) {
      console.log("❌ handleReply error:", err.message);
      nayan.sendMessage(senderId, { text: "❌ Error continuing conversation." });
    }
  }
};

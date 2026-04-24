module.exports = {
  config: {
    name: "emojimix",
    aliases: ["mixemoji"],
    version: "1.0.1",
    permission: 0,
    credits: "MOHAMMAD NAYAN",
    prefix: true,
    description: "Mix two emojis into one image",
    category: "image",
    usages: "😀 | 😎"
  },

  start: async function ({ senderId, args, nayan }) {
    const axios = require("axios");

    try {
      if (!args.length) {
        return nayan.sendMessage(senderId, {
          text: `❌ Wrong format\nUsage: /emojimix 😀 | 😎`
        });
      }

      const content = args.join(" ").split("|").map(e => e.trim());
      const emoji1 = content[0];
      const emoji2 = content[1];

      if (!emoji1 || !emoji2) {
        return nayan.sendMessage(senderId, {
          text: "⚠️ Please provide two emojis\nExample: /emojimix 😀 | 😎"
        });
      }

      
      const apiList = await axios.get(
        "https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json"
      );
      const base = apiList.data.api;

      const imageUrl = `${base}/nayan/emojimix?emoji1=${encodeURIComponent(
        emoji1
      )}&emoji2=${encodeURIComponent(emoji2)}`;

      await nayan.sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: imageUrl
          }
        }
      });

      await nayan.sendGeneric(
        senderId,
        "Help Menu 📜",
        imageUrl,
        "helpText"
      );

    } catch (err) {
      console.error("[EMOJIMIX ERROR]", err.message);
      await nayan.sendMessage(senderId, {
        text: "❌ Can't mix these emojis"
      });
    }
  }
};

const axios = require("axios");

module.exports = {
  config: {
    name: "alldown",
    aliases: ["dl"],
    permission: 0,
    prefix: true,
    description: "Download video using postback"
  },

  async start({ senderId, args, nayan }) {
    const url = args[0];
    if (!url) {
      return nayan.sendMessage(senderId, {
        text: "❌ Usage:\n/alldown <video_url>"
      });
    }

    try {
      const api = `https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(api);

      if (!data.status) {
        return nayan.sendMessage(senderId, { text: "❌ Download failed" });
      }

      const info = data.data;
      await nayan.sendMessage(senderId, { text: `🎬 Title: ${info.title}` });

      await nayan.sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: info.high
          }
        }
      });

    } catch (e) {
      console.error(e);
      await nayan.sendMessage(senderId, { text: "⚠️ Error occurred" });
    } finally {
      return;
    }
  },

  handleEvent: async function({ senderId, args, text, nayan, event, config, commands }) {
    
    const url = text
    

    if (!url || !url.startsWith("https")) return;

    
    try {
      const api = `https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(api);
      console.log(data)

      if (!data.status) {
        return nayan.sendMessage(senderId, { text: "❌ Download failed" });
      }

      const info = data.data;

      await nayan.sendMessage(senderId, { text: `🎬 Title: ${info.title}` });

      await nayan.sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: info.high
          }
        }
      });

    } catch (e) {
      console.error(e);
      await nayan.sendMessage(senderId, { text: "⚠️ Error occurred" });
    }
  }
};

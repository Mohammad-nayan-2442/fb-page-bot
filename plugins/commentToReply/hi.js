module.exports = {
  config: {
    keywords: ["hi", "hello", "hey", "hle"]
  },

  run: async ({ commentId, sender, replyToComment, nayan}) => {
    await replyToComment(
      commentId,
      `@[${sender.id}] 👋 Hey! How can I help you? 😊`
    );

    await nayan.sendMessage(sender.id, {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `👋 Hi! ${value.from.name}\n\nThanks for your comment 💙\nYou can contact us using the options below 👇`,
          buttons: [
            {
              type: "web_url",
              url: "https://t.me/MOHAMMADNAYAN",
              title: "📨 Telegram"
            },
            {
              type: "web_url",
              url: "https://wa.me/8801615298449",
              title: "💬 WhatsApp"
            },
            {
              type: "phone_number",
              title: "📞 Call Now",
              payload: "+8801615298449"
            }
          ]
        }
      }
    });
    return true; // stop others
  }
};

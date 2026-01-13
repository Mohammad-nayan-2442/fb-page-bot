module.exports = {
  run: async ({ commentId, sender, replyToComment, nayan, value}) => {
    await replyToComment(
      commentId,
      `@[${sender.id}] ❤️ Thanks for your comment!`
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
    return true;
  }
};

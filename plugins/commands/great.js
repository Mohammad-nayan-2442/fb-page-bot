module.exports = {
  config: {
    name: "greet",
    aliases: [],
    permission: 0,
    prefix: false,
    description: "Auto reply for greetings"
  },

  handleEvent: async function ({ senderId, text, nayan }) {
    if (!text) return;

    const msg = text.toLowerCase();

    const greetings = [
      "hi",
      "hello",
      "hlw",
      "hey",
      "assalamualaikum",
      "asalamualaikum",
      "salam",
      "yo"
    ];

    
    const matched = greetings.some(g => msg.includes(g));

    if (!matched) return;

    const replies = [
      "🤖 Hey! I'm here for you.",
      "✨ Hello! How can I help you today?",
      "🙌 Hi there! Send /help to see commands."
    ];

    const reply = replies[Math.floor(Math.random() * replies.length)];

    await nayan.sendMessage(senderId, { text: reply });
  }
};

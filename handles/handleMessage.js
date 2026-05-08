const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const { commands } = require("./load.js")
const { nayan } = require("./nayan.js")
//const commands = new Map();


global.lastMessages = global.lastMessages || new Map();

// Ensure global.client.handleReply exists
if (!global.client) global.client = {};
if (!Array.isArray(global.client.handleReply)) global.client.handleReply = [];

/**
 * Handle incoming message
 * @param {object} event
 */
async function handleMessage(event) {
  console.log(event)
  const senderId = event.sender.id || event.from.id;
  
  const message = event.message;
  if (!message || message.is_echo) return;

  const timestamp = event.timestamp;
  const key = `${senderId}:${timestamp}`;
  if (global.lastMessages.has(key)) return;
  global.lastMessages.set(key, true);

  const text = message.text ? message.text.trim() : "";
  const originalArgs = text ? text.split(/\s+/) : [];

  let commandExecuted = false;

  /* ==========================
     1️⃣ HANDLE COMMAND (start)
     ========================== */
  for (const cmd of commands.values()) {
    const name = cmd.config.name.toLowerCase();
    const aliases = (cmd.config.aliases || []).map(a => a.toLowerCase());
    const prefixMode = cmd.config.prefix;

    let args = [];
    let inputCmd = "";

    if (prefixMode === true && text.startsWith(config.prefix)) {
      args = text.slice(config.prefix.length).split(/\s+/);
    } else if (prefixMode === false && !text.startsWith(config.prefix)) {
      args = text.split(/\s+/);
    } else if (prefixMode === 'both') {
      args = text.startsWith(config.prefix)
        ? text.slice(config.prefix.length).split(/\s+/)
        : text.split(/\s+/);
    } else continue;

    inputCmd = args.shift()?.toLowerCase();
    if (inputCmd !== name && !aliases.includes(inputCmd)) continue;

    // 🔐 Permission check
    if (cmd.config.permission === 2 && !config.adminUIDs.includes(senderId)) {
      await nayan.sendMessage(senderId, { text: '⛔ Admin only command' });
      return;
    }

    try {
      await cmd.start({ senderId, args, nayan, event, config, commands });
    } catch (e) {
      console.error(`[CMD ERROR] ${name}`, e);
      await nayan.sendMessage(senderId, { text: '⚠️ Command failed' });
    }
  }

  /* ==========================
     2️⃣ HANDLE REPLY
     ========================== */
  if (message.reply_to) {
    const replyID = message.reply_to.messageID || message.reply_to.mid;
    const replyEntry = global.client.handleReply.find(r => r.messageID === replyID);

    if (replyEntry) {
      const cmd = commands.get(replyEntry.name.toLowerCase());
      if (cmd?.handleReply) {
        try {
          await cmd.handleReply({
            senderId,
            args: originalArgs,
            text,
            replyTo: replyEntry,
            nayan,
            event,
            config,
            commands
          });
        } catch (e) {
          console.error(`[REPLY ERROR] ${replyEntry.name}`, e);
          await nayan.sendMessage(senderId, { text: '⚠️ Reply failed' });
        }
        return; // ✅ reply handled, stop
      }
    }
  }

  /* ==========================
     3️⃣ HANDLE EVENT (fallback)
     ========================== */
  if (!commandExecuted) {
    for (const [name, cmd] of commands.entries()) {
      if (typeof cmd.handleEvent === 'function') {
        try {
          await cmd.handleEvent({
            senderId,
            args: originalArgs,
            text,
            nayan,
            event,
            config,
            commands
          });
        } catch (e) {
          console.error(`[EVENT ERROR] ${name}`, e);
        }
      }
    }
  }
}

module.exports = { handleMessage };

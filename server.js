const express = require("express");
const noblox = require("noblox.js");
require("dotenv").config();

const app = express();
app.use(express.json());

const groupId = Number(process.env.GROUP_ID);
const apiKey = process.env.API_KEY;

noblox.setCookie(process.env.ROBLOX_COOKIE);

app.post("/rank", async (req, res) => {
  const { action, username, rankId, key } = req.body;
  if (key !== apiKey) return res.status(403).json({ error: "Invalid API key" });

  try {
    const userId = await noblox.getIdFromUsername(username);
    let result;
    if (action === "promote") result = await noblox.promote(groupId, userId);
    else if (action === "demote") result = await noblox.demote(groupId, userId);
    else if (action === "setrank") result = await noblox.setRank(groupId, userId, rankId);
    else return res.status(400).json({ error: "Invalid action" });

    const newRank = await noblox.getRole(groupId, result.rank || result);
    res.json({ username, newRankName: newRank.name, newRankId: newRank.rank });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Ranking API live on port 3000"));

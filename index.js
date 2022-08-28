import express from "express";
import cors from "cors";

const server = express();
server.use(cors());
server.use(express.json());

const port = "5000";

const signup = [];
const tweets = [];

function getTweet(tweet) {
  const avatar = signup.find(
    (user) => user.username === tweet.username
  )?.avatar;
  return { ...tweet, avatar };
}

function isValid(body, fields) {
  if (typeof body !== "object") {
    return false;
  }
  for (const field of fields) {
    const value = body[field];
    if (typeof value !== "string") {
      return false;
    }
    if (value.length === 0) {
      return false;
    }
  }
  return true;
}

server.post("/sign-up", (req, res) => {
  if (!isValid(req.body, ["username", "avatar"])) {
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }
  signup.push(req.body);
  res.status(201).send("Ok");
});

server.post("/tweets", (req, res) => {
  if (!isValid(req.body, ["username", "tweet"])) {
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }
  tweets.push(req.body);

  res.status(201).send("Ok");
});

server.get("/tweets", (req, res) => {
  const lastTweets = tweets.slice(-10);
  res.send(lastTweets.map(getTweet));
});

server.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  const myTweets = tweets.filter((tweet) => tweet.username === username);
  res.send(myTweets.map(getTweet));
});

server.listen(port);

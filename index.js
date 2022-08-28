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

server.post("/sign-up", (req, res) => {
  signup.push(req.body);
  res.send("Ok");
});

server.post("/tweets", (req, res) => {
  tweets.push(req.body);

  res.send("Ok");
});
server.listen(port);

server.get("/tweets", (req, res) => {
  const lastTweets = tweets.slice(-10);
  res.send(lastTweets.map(getTweet));
});

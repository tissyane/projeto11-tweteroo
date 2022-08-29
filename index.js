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

function isUser(username) {
  return signup.some((value) => value.username === username);
}

server.post("/sign-up", (req, res) => {
  if (!isValid(req.body, ["username", "avatar"])) {
    return res.status(400).send({
      message: "Todos os campos são obrigatórios!",
    });
  }
  if (
    !(
      req.body.avatar.startsWith("https://") ||
      req.body.avatar.startsWith("http://")
    )
  ) {
    return res.status(415).send({
      message: "Verifique a URL da sua imagem!",
    });
  }
  if (isUser(req.body.username)) {
    return res.status(409).send({
      message: "Usuário já cadastrado",
    });
  }
  signup.push(req.body);
  res.status(201).send("Ok");
});

server.post("/tweets", (req, res) => {
  if (!isValid(req.body, ["username", "tweet"])) {
    return res.status(400).send({
      message: "Todos os campos são obrigatórios!",
    });
  }
  if (!isUser(req.body.username)) {
    return res.status(401).send({
      message: "Faça login para enviar seu tweet!",
    });
  }
  tweets.push(req.body);
  res.status(201).send("Ok");
});

server.get("/tweets", (req, res) => {
  const page = Number(req.query.page);
  const maxPage = Math.ceil(tweets.length / 10);

  if (page < 1 || page > maxPage) {
    return res.status(400).send({
      message: "Informe uma página válida!",
    });
  }

  const lastTweets = [...tweets].reverse().splice(page * 10 - 10, 10);

  res.send(lastTweets.map(getTweet));
});

server.get("/tweets/:username", (req, res) => {
  const { username } = req.params;

  if (!isUser(username)) {
    return res.status(404).send({
      message: "Usuário não cadastrado",
    });
  }

  const myTweets = tweets.filter((tweet) => tweet.username === username);

  res.send(myTweets.reverse().map(getTweet));
});

server.listen(port);

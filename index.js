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
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }
  if (
    !(
      req.body.avatar.startsWith("https://") ||
      req.body.avatar.startsWith("http://")
    )
  ) {
    res.status(400).send("Verifique a URL da sua imagem!");
    return;
  }
  if (isUser(req.body.username)) {
    res.status(400).send("Usuário já cadastrado");
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
  if (!isUser(req.body.username)) {
    res.status(400).send("Faça login para enviar seu tweet!");
    return;
  }
  tweets.push(req.body);
  res.status(201).send("Ok");
});

server.get("/tweets", (req, res) => {
  let page = parseInt(req.query.page);
  const maxPage = Math.ceil(tweets.length / 10);

  if (!page) {
    page = 1;
  }

  if (page < 1 || page > maxPage) {
    res.status(400).send({
      message: "Informe uma página válida!",
    });

    return;
  }

  const lastTweets = [...tweets].reverse().splice(page * 10 - 10, 10);

  res.send(lastTweets.map(getTweet));
});

server.get("/tweets/:username", (req, res) => {
  const { username } = req.params;

  if (!isUser(username)) {
    res.status(400).send("Usuário não cadastrado");
    return;
  }

  const myTweets = tweets.filter((tweet) => tweet.username === username);

  res.send(myTweets.reverse().map(getTweet));
});

server.listen(port);

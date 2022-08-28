import express from "express";
import cors from "cors";

const server = express();
server.use(cors());
server.use(express.json());

const port = "5000";

const signup = [];
const tweets = [];

server.post("/sign-up", (req, res) => {
  signup.push(req.body);
  res.send("Ok");
});

server.listen(port);

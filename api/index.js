import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from  'express-oauth2-jwt-bearer'
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
//await prisma.notedb.deleteMany();

const requireAuth = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER,
    tokenSigningAlg: 'RS256'
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.User.findUnique({
    where: {
      auth0Id,
    },
  });
  res.json(user);
});

app.get("/videos", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.User.findUnique({
    where: {
      auth0Id,
    },
    include: { favourites: true },
  });

  res.json(user.favourites);
});

app.get("/channels", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.User.findUnique({
    where: {
      auth0Id,
    },
    include: { subscriptions: true },
  });

  res.json(user.subscriptions);
});

app.post("/video", requireAuth, async (req, res) => {
  const {id, cover, title} = req.body;
  const description=req.body.description.slice(0, 99);
  const auth0Id = req.auth.payload.sub;
  const video = await prisma.Video.findUnique({
    where: {
      id,
    },
  });

  if(!video){
    await prisma.Video.create({
      data: {
        id, 
        description, 
        cover, 
        title,
        user: { connect: { auth0Id: auth0Id } }
      },
    });
  }
  prisma.User.update({
    where: {
      auth0Id,
    },
    data: { 
      favourites: { connect: { id: id } } 
    },
  });

  res.json(video);
});

app.post("/channel", requireAuth, async (req, res) => {
  const {id, avatar, name} = req.body;
  const description=req.body.description.slice(0, 99);
  const auth0Id = req.auth.payload.sub;
  const channel = await prisma.Channel.findUnique({
    where: {
      id,
    },
  });

  if(!channel){
    await prisma.Channel.create({
      data: {
        id, 
        description, 
        avatar, 
        name,
        user: { connect: { auth0Id: auth0Id } }
      },
    });
  }
  prisma.User.update({
    where: {
      auth0Id,
    },
    data: { 
      subscriptions: { connect: { id: id } } 
    },
  });

  res.json(channel);
});


app.delete("/video/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.User.findUnique({
    where: {
      auth0Id,
    },
  });
  const userId=user.id;

  const video = await prisma.Video.deleteMany({
    where: {
      AND: [
        { id:id },
        { userId:userId },
      ],
    },
  });
  res.json(video);
});

app.delete("/channel/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.User.findUnique({
    where: {
      auth0Id,
    },
  });
  const userId=user.id;

  const channel = await prisma.Channel.deleteMany({
    where: {
      AND: [
        { id:id },
        { userId:userId },
      ],
    },
  });
  res.json(channel);
});

app.put("/user/:auth0Id", requireAuth, async (req, res) => {
  const auth0Id = req.params.auth0Id;
  const body = req.body;
  
  const data = await prisma.User.update({
    where:{
      auth0Id,
    },
    data: body,
  })
  res.json(data);
});

app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});


// app.listen(8000, () => {
//   console.log("Server running on http://localhost:8000");
// });

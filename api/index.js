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
  });
  res.json(user.favourites);
});


app.post("/create", requireAuth, async (req, res) => {
  const {id, description, cover, title} = req.body;
  const auth0Id = req.auth.payload.sub;
  const video = prisma.Video.findUnique({
    where: {
      id,
    },
  });
  if(!video){
    const video = await prisma.Video.create({
      data: {
        id, 
        description, 
        cover, 
        title
      },
    });
  }
  prisma.User.update({
    where: {
      auth0Id,
    },
    data: { favourites: { connect: { id: id } } },
  });

  res.json(video);
});


app.delete("/video/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const auth0Id = req.auth.payload.sub;
  const video = prisma.Video.findUnique({
    where: {
      id,
    },
  });
  if (!video) {
    res.json(video);
  } else {
    prisma.User.update({
      where: {
        auth0Id,
      },
      data: { favourites: { disconnect: { id: id } } },
    });

    res.json(video);
  }
});
/**
app.get("/note/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const note = await prisma.notedb.findUnique({
    where:{
      id:id,
    }
  })
  res.json(note);
});
 */
app.put("/note/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  const note = await prisma.notedb.update({
    where:{
      id:id,
    },
    data: body,
  })
  res.json(note);
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

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});

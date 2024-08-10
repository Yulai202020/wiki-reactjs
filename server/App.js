// imports
const cookieParser = require("cookie-parser");
const express = require("express");
var cors = require("cors")

const jwt = require("jsonwebtoken");

// include prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// init app
const app = express();
const PORT = 8000;

// init needed vars
var photos_folder = "photos"
var encrypter = "ibutytuiu89r56tcyjhknklihg8fty"

// init cors optoin
var corsOptions = {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// start server
app.listen(PORT, () => console.log("Server started."));

// apply extensions to app
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/post/:id", async (req, res) => {
    // get username
    const id = Number(req.params.id);
    const response = await prisma.post.findFirst({ where: { id: id } })

    console.log("Sended post:")
    console.log(response);

    if (response === null) {
        return res.status(404).json({ message: "Post not found" })
    }

    return res.status(200).json(response);
});

app.get("/api/posts", async (req, res) => {
    const response = await prisma.post.findMany();

    console.log("Sended posts:")
    console.log(response);

    return res.status(200).json(response);
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const response = await prisma.user.findFirst({ where: { username: username }});

    if (response === null) {
        return res.status(404).json({ message: "Username not found" });
    }
    if (response.password !== password) {
        return res.status(403).json({ message: "Invalid password" });
    }

    console.log("Logined in user:");
    console.log(response)

    const token = jwt.sign({ username }, encrypter, { expiresIn: "1h" });
    return res.status(200).json({ token });
});

app.post("/api/remove", async (req, res) => {
    const { id } = req.body;
    const token = req.cookies.token;

    var username;
    var numId = Number(id);

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    const response = await prisma.post.findFirst({ where: { id: numId, username: username} });

    console.log("Removed image:");
    console.log(response)

    if (response === null) {
        return res.status(404).send({ message: "File not found." });
    }

    await prisma.post.delete({ where: { id: numId, username: username} });
    return res.status(200).json({ message: "OK" });
});

app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    const response = await prisma.user.findFirst({ where: { username: username }});

    if (response === null) {
        const user = await prisma.user.create({ data: { username: username,  password: password }});
        const token = jwt.sign({ username }, encrypter, { expiresIn: "1h" });
        
        console.log("Created user:");
        console.log(user)

        return res.status(200).json({ token });
    } else {
        return res.status(403).json({ message: "User already exists" });
    }
});

app.post("/api/add", async (req, res) => {
    const { subject, text } = req.body;
    const token = req.cookies.token;
    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    await prisma.post.create({ data: { subject: subject, text: text, username: username } });
    return res.status(200).json({ message: "OK" })
});
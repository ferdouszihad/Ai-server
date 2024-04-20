require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId, Binary } = require("mongodb");

//middlewartes
app.use(express.json());
app.use(cors());
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function test() {
  try {
    client.connect();

    app.post("/generate-text", async (req, res) => {
      const prompt = req.body.prompt;
      console.log(prompt);
      if (!prompt) {
        return res.status(400).send("give a valid prompt");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      res.send({ response: text });
    });

    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
test().catch(console.dir);
app.get("/", async (req, res) => {
  res.send({ status: "Server running ", code: "200" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

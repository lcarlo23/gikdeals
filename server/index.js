import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/*", async (req, res) => {
  try {
    const path = req.originalUrl.replace("/api", "");
    const targetUrl = `https://gamerpower.com/api${path}`;

    const response = await fetch(targetUrl);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server started on " + port));

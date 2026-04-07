import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { country: null, error: null });
});

app.post("/search", async (req, res) => {
  const countryName = req.body.country;

  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    const data = response.data[0];

    const country = {
      name: data.name.common,
      capital: data.capital ? data.capital[0] : "N/A",
      population: data.population ? data.population.toLocaleString() : "N/A",
      region: data.region || "N/A",
      flag: data.flags ? data.flags.png : ""
    };

    res.render("index", { country, error: null });
  } catch (error) {
    res.render("index", {
      country: null,
      error: "Country not found. Please enter a valid country name."
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
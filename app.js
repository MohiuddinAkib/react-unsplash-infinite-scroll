require("es6-promise").polyfill();
require("isomorphic-fetch");

const express = require("express"),
  compress = require("compression"),
  helmet = require("helmet"),
  config = require("config"),
  cors = require("cors"),
  morgan = require("morgan"),
  debug = require("debug")("app:main"),
  Unsplash = require("unsplash-js").default,
  toJson = require("unsplash-js").toJson;

// Init app
const app = express();

// Init nunsplash
const unsplash = new Unsplash({
  applicationId: process.env.APPLICATION_ID || config.get("APPLICATION_ID"),
  secret: process.env.SECRET || config.get("SECRET"),
  callbackUrl: config.get("CALLBACK_URL")
});

// middlewares
app.use(cors());
if (app.get("env") === "development") {
  app.use(morgan("dev"));
  debug("Morgan enabled...");
}
if (app.get("env") === "production") {
  app.use(helmet());
  app.use(compress());
}

// Routes
app.get("/api/photos", (req, res) =>
  unsplash.photos
    .listPhotos(req.query.start, req.query.count, "latest")
    .then(toJson)
    .then(data => res.json(data))
);

// PORT
const PORT = process.env.PORT || 8000;
// Listen for request
app.listen(PORT, () => debug(`Server running on port ${PORT}`));

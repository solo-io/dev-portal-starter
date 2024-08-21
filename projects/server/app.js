var express = require("express");
var path = require("path");

// Express and view engine setup
var app = express();
app.set("views", path.join(__dirname, "public", "dist"));
app.set("view engine", "ejs");

// The environment variables that we will pass through to the React app.
var variablesInit = `
window.__appEnvironmentVariables = ${JSON.stringify(
  Object.fromEntries(
    Object.entries(process.env).filter(([key, _value]) =>
      key.startsWith("VITE_")
    )
  )
)};
`;

// This renders the index.ejs file
app.get("/", (_req, res) => {
  res.render("index.ejs", { VariablesInit: variablesInit });
});

// This serves all static assets.
app.use(express.static(__dirname + "/public/dist"));

// Any fallthrough routes go to index.ejs.
app.get("*", (_req, res) => {
  res.render("index.ejs", { VariablesInit: variablesInit });
});

module.exports = app;

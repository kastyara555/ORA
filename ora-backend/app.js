var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

const { connection } = require("./db/connection");
var apiRouter = require("./routes/api/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser());
// Для локали
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, '../', "public")));

// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
// app.use((req, res, next) => {
//   if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
//       next();
//   } else {
//       res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//       res.header('Expires', '-1');
//       res.header('Pragma', 'no-cache');
//       res.sendFile(path.join(__dirname, "front-end", "build", "index.html"));
//   }
// });
// app.use(express.static(path.join(__dirname, "front-end", "build")));

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function gracefulshutdown() {
  console.log("Shutting down");
  app.close(() => {
    console.log("HTTP server closed.");

    connection.close();

    // When server has stopped accepting connections  
    // exit the process with exit status 0 
    process.exit(0);
  });
}

process.on("SIGTERM", gracefulshutdown);

module.exports = app;

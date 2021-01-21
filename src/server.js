let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
let webpush = require("web-push");
let app = express();

// implementation of middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

// Get data
app.get("/", (req, res) => {
  res.send("Push Notifications Successful.");
});

webpush.setVapidDetails(
  "mailto: silvinpradhan95@gmail.com",
  "BGyqNYaBGEOTctaSwWl4Sn7-mJu01qcc_n4iAHAOlquVwfYISsed95Oosx43txhNwA-6kBx5BakGL5V0zKZuyZQ",
  "CRBWg6_pBo3BMCUMnwmAMmW2-R7duYXhKHJfA0w7vcE"
);

// post data
app.post("/subscribe", (req, res) => {
  const sub = req.body;

  res.status(201).json({});
  res.set("Content-Type", "application/json");

  const payload = JSON.stringify({
    notification: {
      title: "Authentication Notification",
      body: "Thank you for subscribing to this application",
      icon: "https://img.icons8.com/color/2x/firebase.png",
    },
  });

  webpush
    .sendNotification(sub, payload)
    .then(() =>
      res.status(200).json({
        message: " Notification successfuly sent",
      })
    )
    .catch((err) => console.log(err));
});

app.set("port", process.env || 5000);
const server = app.listen(app.get("port"), () => {
  console.log(`Express running  ->  port: ${server.address().port}`);
});

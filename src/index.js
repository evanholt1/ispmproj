require('dotenv').config({path: 'src/config/.env'});
const express = require('express'),
 mongoose = require('mongoose'),
 session = require('express-session'),
 MongoDBStore = require('connect-mongodb-session')(session),
 cookieParser = require('cookie-parser');

const router = require('./utils/router');

const startServer = async () => {
  const app = express();
  
  app.use(express.json());

  await mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

  app.use(cookieParser(process.env.SECRET));

  let sessionStore = new MongoDBStore({
    uri: process.env.DB_HOST,
    collection: 'sessions'
  });

  app.use(session({
    secret: process.env.SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
      //expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    },
    name: "US" // User Session
  }));
  
  app.use("/api", router);
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}`));
}

startServer();

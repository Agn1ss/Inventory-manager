import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routers/user-router.js";
import oauthRouter from "./routers/oAuth-router.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import inventoryRouter from "./routers/inventory-router.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());


app.use("/api/inventory", inventoryRouter)
app.use("/api/oauth", oauthRouter);
app.use("/api/", userRouter);
app.use(errorMiddleware);

const start = async () => {
  app.listen(PORT, err => {
    if (err) {
      console.error("Server failed to start:", err);
      return;
    }
    console.log(`Server started on port ${PORT}`);
  });
};

start();

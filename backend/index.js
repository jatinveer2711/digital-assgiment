import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/user.route.js";
import assigmentRoutes from "./routes/assigment.route.js";
import sumbissionRoutes from "./routes/sumbission.route.js";
import cors from "cors";

// middleware
const app = express();
app.use(express.json());
app.use(cors());



const Port = process.env.PORT || 5000

const MONGOURI = process.env.MONGO_URI

app.get("/", (req, res) => {
  res.send("Server is running...");
});
// user routes
app.use("/api/users", userRoutes);
app.use("/api/assignments", assigmentRoutes);
app.use("/api/sumbission", sumbissionRoutes);

// connect to MongoDv

mongoose.connect(MONGOURI).
  then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.log(err))


app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
// routes/testTokenRoute.js
import express from "express";
import jwt from "jsonwebtoken";

const testTokenRouter = express.Router();

testTokenRouter.get("/generate-token/:userID", (req, res) => {
  const { userID } = req.params;

  const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ success: true, token });
});

export default testTokenRouter;

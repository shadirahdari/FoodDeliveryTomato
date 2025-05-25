import express from "express"
import { addToCart, removeFromCart, getCart, clearCart } from "../controllers/cardController.js"
import authMiddleware from "../middleware/auth.js"

const cartRouter = express.Router()

// All cart routes should be protected
cartRouter.use(authMiddleware);

// Cart routes
cartRouter.post("/add", addToCart)
cartRouter.post("/remove", removeFromCart)
cartRouter.post('/get', getCart)
cartRouter.post('/clear', clearCart)

export default cartRouter;
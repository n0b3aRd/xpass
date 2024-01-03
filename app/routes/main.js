import express from "express";
import logger from "../utils/logger.js";
import { lynked_ws } from "../../server";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "success" });
});


router.post("/trigger", (req, res) => {
  const isValid = true; //validate inputs
  if (isValid) {
    const event = req.body.event;
    const data = req.body.data;
    const room = req.body?.room;
    if (room == undefined) {
      lynked_ws.emit(event, data);
      logger.info(event + " triggered from API");
    } else {
      lynked_ws.to(room).emit(event, data);
      logger.info(event + " " + room + " room triggered from API");
    }
    res.json({ status: "success", message: "Event triggerd" });
  } else {
    logger.info("Invalid API resuest");
    res.statusCode(400).json({
      status: "error",
      message: "Unprocessable request. Please check inputs",
    });
  }
});

export default router;

import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { requestLogger } from "../middleware/requestlogger.middleware";
import router from "../routes/v1";
import { allowedCorsOrigins } from "../utils/corsorigins.util";
import { errorResponse } from "../utils/response.util";

const app = express();

app.use(
  cors({
    origin: allowedCorsOrigins,
    credentials: true,
  })
);

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use("/api/v1/", router);

app.use("*", (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json(
    errorResponse({
      error: "404 not found",
      message: "This endpoint is not available",
    })
  );
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
    errorResponse({
      error: "Internal Server Error",
      message: "Something went wrong. Please try again later.",
    })
  );
});

export default app;

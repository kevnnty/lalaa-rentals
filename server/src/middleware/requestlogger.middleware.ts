import { NextFunction, Request, Response } from "express";
import morgan from "morgan";

const colors = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

morgan.token("statusColor", (req: Request, res: Response) => {
  const status = res.statusCode;
  if (status >= 500) return `${colors.red}${status}${colors.reset}`;
  if (status >= 400) return `${colors.yellow}${status}${colors.reset}`;
  return `${colors.green}${status}${colors.reset}`;
});

const logRequests = morgan(`${colors.blue}:method${colors.reset} :url :statusColor - :response-time ms`, {
  stream: { write: (message) => console.log(message.trim()) },
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logRequests(req, res, next);
};

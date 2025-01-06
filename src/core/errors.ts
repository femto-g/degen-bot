// interface CustomErrorInterface extends Error {
//     name: string;
//     message: string;
//   }

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

export class RequestError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "RequestError";
  }
}

export class RateLimitExceededError extends RequestError {
  constructor() {
    super("Rate Limit Exceeded. Try again in a minute.");
    this.name = "RateLimitExceededError";
  }
}

export class InvalidTickerError extends RequestError {
  constructor() {
    super("Invalid Ticker. Please try again with a valid ticker symbol.");
    this.name = "InvalidTickerError";
  }
}

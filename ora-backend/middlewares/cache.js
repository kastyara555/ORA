const memoryCache = require("memory-cache");

const cache = (duration) => (req, res, next) => {
  const key = "__express__" + req.originalUrl || req.url;
  const cachedBody = memoryCache.get(key);

  if (cachedBody) {
    return res.send(cachedBody);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      memoryCache.put(key, body, duration * 1_000);
      res.sendResponse(body);
    };
    next();
  }
};

module.exports = { cache };

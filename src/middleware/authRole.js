import logger from "./logger.js";

export const authRole = (role) => {
  return (request, response, next) => {
    role = role.map(r => r.toLowerCase())
    if (!request.session.user) {
      request.logger.error(`Request: ${request.method} Unauthenticated user requested access to: ${request.originalUrl}`)
      logger.debug(request.session.user.role);
      response.setHeader("Content-Type", "application/json");
      return response.status(403).json({ error: "Access denied" });
    }
    if (!role.includes(request.session.user.role.toLowerCase())) {
      request.logger.error(`Request: ${request.method} Unauthorized user requested access to: ${request.originalUrl}`)
      logger.debug(request.session.user.role);
      response.setHeader("Content-Type", "application/json");
      return response.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
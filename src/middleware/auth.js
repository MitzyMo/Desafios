export const auth = (request, response, next) => {
  if (!request.session.user) {
    response.setHeader("Content-Type", "application/json");
    return response.status(401).json({ error: `No authenticated users` });
  }
  next();
};
export const authRole = (role) => {
  return (request, response, next) => {
    if (!request.session.user || request.session.user.role !== role) {
      response.setHeader("Content-Type", "application/json");
      return response.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
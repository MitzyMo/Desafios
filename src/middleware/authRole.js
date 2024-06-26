export const authRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      res.setHeader("Content-Type", "application/json");
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
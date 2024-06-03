export const auth = (request, response, next) => {
  if (!request.session.user) {
    response.setHeader("Content-Type", "application/json");
    return response.status(401).json({ error: `No authenticated users` });
  }
  next();
};
/*   // Middleware to check if user is admin
  const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
      return next(); // Allow access to the route if user is authenticated and admin
    } else {
      res.redirect("/"); // Redirect to home page or some other route if user is not admin
    }
  }; */
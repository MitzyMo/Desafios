import passport from "passport";
import "dotenv/config";
import local from "passport-local";
import github from "passport-github2";
import { UserManager } from "../dao/UserManagerDB.js";
import { generateHash, validatePassword } from "../utils.js";
import { createCartInternal } from "../controller/cartController.js";

const userManager = new UserManager();

export const initPassport = () => {
  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: "http://localhost:3000/api/sessions/callbackGithub",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = profile._json.email;
          let name = profile._json.name;
          if (!email) {
            return done(null, false);
          }
          let user = await userManager.getByPopulate({ email });
          if (!user) {
            let newCart = await createCartInternal();
            user = await userManager.create({
              firstName: name,
              lastName: name,
              email,
              cart: newCart._id,
            });
            user = await userManager.getByPopulate({ email });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new local.Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (request, username, password, done) => {
        try {
          let { firstName, lastName, age, role } = request.body;
          if (!firstName || !lastName) {
            return done(null, false);
          }
          let exists = await userManager.getBy({ email: username });
          if (exists) {
            return done(null, false);
          }
          let newCart = await createCartInternal();
          password = generateHash(password);
          let user = await userManager.create({
            firstName,
            lastName,
            age,
            email: username,
            role,
            password,
            cart: newCart._id,
          });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (request, username, password, done) => {
        try {
          let user = await userManager.getByPopulate({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (!validatePassword(password, user.password)) {
            return done(null, false);
          }
          if (user.email === "adminCoder@coder.com" && password === "adminCod3r123") {
            request.session.isAdmin = true;
            user.role = 'admin';
          } else {
            request.session.isAdmin = false;
            user.role = 'user';
          }
          request.session.user = user;
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.getBy({ _id: id });
    return done(null, user);
  });
};

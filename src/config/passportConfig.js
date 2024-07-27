import passport from "passport";
import { config } from "./config.js";
import local from "passport-local";
import github from "passport-github2";
import { UserManager } from "../dao/UserManagerDB.js";
import { generateHash, validatePassword } from "../utils/utils.js";
import { CartService } from "../services/cartService.js";

const userManager = new UserManager();
////Email With Github...
export const initPassport = () => {
  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
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
            let newCart = await CartService.createCartInternal();
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
//Register...
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
        let newCart = await CartService.createCartInternal();
        password = generateHash(password);
        let user = await userManager.create({
          firstName,
          lastName,
          age,
          email: username,
          role: role || 'user',
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
//Email With Login...
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
        
        if (user.email === config.ADMIN_USER && password === config.ADMIN_PASSWORD) {
          request.session.isAdmin = true;
          user.role = 'admin';
        } else {
          request.session.isAdmin = false;
          if (user.role === 'premium') {
            user.role = 'premium';
          } else {
            user.role = 'user';
          }
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
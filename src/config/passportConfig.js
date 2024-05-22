import passport from "passport";
import "dotenv/config";
import local from "passport-local";
import github from "passport-github2";
import { UserManager } from "../dao/UserManagerDB.js";
import { CartManager } from "../dao/CartManagerDB.js";
import { generateHash, validatePassword } from "../utils.js";
import { createCartInternal } from "../controller/cartController.js";

const userManager = new UserManager();
const cartManager = new CartManager();

// Step # 1
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
            // console.log(profile)
            let email=profile._json.email
            let name=profile._json.name
            if(!email){
                return done(null, false)
            }
            let user=await userManager.getByPopulate({email})
            if(!user){
                let newCart = await createCartInternal();
                user=await userManager.create(
                    {
                        name, email, profile, cart: newCart._id,
                    }
                )
                user=await userManager.getByPopulate({email})
            }
            return done(null, user)
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  // This is the Local Login register
passport.use(
        "register",
        new local.Strategy(
        {
            passReqToCallback: true,
            usernameField: "email",
        },
        async (request, username, password, done) => {
            try {
            let { name, role } = request.body;
            if (!name) {
                return done(null, false);
            }
            let exists = await userManager.getBy({ email: username });
            if (exists) {
                return done(null, false);
            }
            let newCart = await createCartInternal();
            password = generateHash(password);
            let user = await userManager.create({
                name,
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
// lOGIN ACCESS
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
  
          // Check if the logged-in user is the admin
          if (user.email === "adminCoder@coder.com" && password === "adminCod3r123") {
            request.session.isAdmin = true;
            user.role = 'admin'; // set the role to 'admin' in the user object
          } else {
            request.session.isAdmin = false;
            user.role = 'user'; // set the role to 'user' in the user object
          }
          request.session.user = user; // Now assign the user object to session
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  // step 1' (only if sessions are configured)
  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async(id, done)=>{
    let user=await userManager.getBy({_id:id})
    return done(null, user)
})
};

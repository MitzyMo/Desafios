import { Router } from "express";
import { UserManager } from "../dao/UserManagerDB.js";
import { generateHash, validatePassword } from "../utils.js";
import { createCartInternal } from "../controller/cartController.js";
import passport from "passport";
export const router = Router();

const userManager = new UserManager();

router.get("/error", (request, response)=>{
    response.setHeader('Content-Type','application/json');
    return response.status(500).json({error:`You've encountered and error, please validate your data.`})
})

router.post("/register", passport.authenticate("register",{failureRedirect:"/api/sessions/error"}), async (request, response) => {
    let {web} = request.body;
    try {
        if (web) {
            return response.redirect(`/login?message=User registered successfully`);
            } else {
                response.setHeader('Content-Type','application/json');
                return response.status(201).json({payload:"Registro exitoso...!!!", user: request.user});
            }
    } catch (error) {
        response.status(500).json({
            error: `Unexpected error, contact your administrator`,
            detail: `${error.message}`,
        });
    }
});

router.post("/login", passport.authenticate("login", {failureRedirect:"/api/sessions/error"}), async(request, response)=>{
    let {web}=request.body
    let user={...request.user}
    delete user.password
    request.session.user=user
    if(web){
        response.redirect("/products")
    }else{
        response.setHeader('Content-Type','application/json');
        return response.status(200).json({payload:"Succesfull login", user});
    }

})

router.get("/github", passport.authenticate("github", {}), (request, response)=>{})

router.get("/callbackGithub", passport.authenticate("github", {failureRedirect:"/api/sessions/error"}), (request, response)=>{

    console.log("QUERY PARAMS:",request.query)
    request.session.user=request.user
    console.log(request.user)

    response.setHeader('Content-Type','application/json');
    return response.status(200).json({payload:"Succesfull login", user:request.user});
})


router.get("/logout", (request, response) => {
    request.session.destroy((error) => {
        if (error) {
        console.log(error);
        response.setHeader("Content-Type", "application/json");
        return response
            .status(500)
            .json({
            error: `Unexpected error, contact your administrator`,
            detalle: `${error.message}`,
            });
        }
        response.redirect("/?message=Logout successfully"); // redirect to home page
    });
});

export default router;

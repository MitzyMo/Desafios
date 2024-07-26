import { UserService } from "../services/UserService.js"
import jwt from "jsonwebtoken"
import {config} from "../config/config.js"
import logger from "../middleware/logger.js";
import { emailTransport, generateHash, validatePassword } from "../utils/utils.js"
import { isValidObjectId } from "mongoose"

export const getResetPassword = async (request, response) => {
    let { email } = request.body;;
    try {
        let user = await UserService.verifyEmail(email);
        console.log('user: ', user);
        if (user) {    
            let token = jwt.sign(user, config.SECRETJWT, { expiresIn: "1h" });
            response.cookie("usercookie", token, { httpOnly: true });
            // Email Structure:
            let emailStructure = `<h2>Click on the following link to reset your password</h2>
                                  <a href="http://localhost:${config.PORT}/newPassword/${token}">Reset Password</a>`;
            // Send Email
            await emailTransport(user.email, "Reseting Password", emailStructure);

            response.setHeader("Content-Type", "text/html");
            response.status(200).json(`You will receive an email at ${user.email} to reset your password.`);
        } else {
            response.setHeader("Content-Type", "text/html");
            response.status(404).json({ message: "The email is not register." });
        }
    } catch (error) {
        response.setHeader("Content-Type", "application/json");
        response.status(500).json({ Error: "Error 500 - Unexpected Error." });
    }
};


export const getValidateNewPassword = async (request, response) => {

        if (!request.cookies.usercookie) {
            response.setHeader("Content-Type", "application/json")
            return response.status(400).json({ error: "The password was already set" })
        }
        let {password} = request.body
        let token = request.params.token
        
        let decodedToken = jwt.verify(token, config.SECRETJWT)
        console.log(password)
        console.log(decodedToken)

        //Save users ID
        let id = decodedToken._id       

        try {
            //Validate is not the same password previousle set
            if (!validatePassword(password, decodedToken.password)) {
                logger.debug("Pwd diffeent it may be hashed and save")
                let hashedPassword = generateHash(password)
                let result = await UserService.updatePassword(id, hashedPassword)
                response.clearCookie("usercookie")
                response.setHeader("Content-Type", "text/html")
                response.status(200).json(result)
            } else {
                response.setHeader("Content-Type", "text/html")
                response.status(400).json({ message: "The new password has to be different from the one previously set." });

            }            
        } catch (error) {
            response.setHeader("Content-Type", "application/json")
            return response.status(500).json({ error: "Error en el Servidor al querer actualizar la clave del usuario" })            
        }
    }

export const getPremium = async (request, response) => {

        let id = request.params.uid
        //Validate mongo format
        if (!isValidObjectId(id)) {
            response.setHeader("Content-Type", "application/json")
            return response.status(400).json({
              message: "Error, el id requerido no tiene un formato valido de MongoDB"
          });
        }
        
        try {
            //Validate if this user exists
            let user = await UserService.getUserById({_id:id})
            if (!user) {
                response.setHeader("Content-Type", "application/json")
                return response.status(400).json({
                  message: `User with ${id} does not exist.`
              });               
            }
            //moDIFY THE
            if (user.role == "user") {
                let newRole = "premium"
                let newUser = await UserService.updateRole(id, newRole)
                response.setHeader("Content-Type", "text/html")
                response.status(200).json(newUser)  
            } else {
                let newRole = "user"
                let newUser = await UserService.updateRole(id, newRole)
                response.setHeader("Content-Type", "text/html")
                response.status(200).json(newUser)            
            }
        } catch (error) {
            response.setHeader("Content-Type", "application/json")
            return response.status(500).json({ error: "Unexpected error while modifying user." })            
        }        
    }  
    



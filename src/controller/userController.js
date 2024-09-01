import { UserService} from "../services/UserService.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";
import logger from "../middleware/logger.js";
import {
  emailTransport,
  generateHash,
  validatePassword
} from "../utils/utils.js";

export const getUsers = async (request, response) => {
  logger.debug(`Entered getUsers`);
  try {
    const limit = request.query.limit;
    const {
      totalUsers,
      data
    } = await UserService.getUsers(limit);
    response.json({
      totalUsers,
      data
    });
    console.log(totalUsers, data);
  } catch (error) {
    response.status(500).json({
      error: "Error fetching Users."
    });
  }
};

export const getUsersPaginate = async (request, response) => {
  const { limit, page, role, last_connection, sort } = request.query;

  let sortQuery = {};
  if (sort === "asc") {
    sortQuery = { role: 1 };
  } else if (sort === "dsc") {
    sortQuery = { role: -1 };
  }

  let filterQuery = {};
  if (role !== "null") {
    filterQuery.role = role;
  }
  if (last_connection !== undefined && last_connection !== null) {
    filterQuery.last_connection = last_connection;
  }

  try {
    const result = await UserService.getUsersPaginate(limit, page, role, last_connection, sort);
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

export const getUserById = async (request, response) => {
  try {
    const uid = request.params.uid;
    const user = await UserService.getUserById(uid);
    response.json({
      user
    });
  } catch (error) {
    response.status(404).json({
      error: error.message
    });
  }
};

export const getResetPassword = async (request, response) => {
  let {
    email
  } = request.body;
  try {
    let user = await UserService.verifyEmail(email);
    if (user) {
      let token = jwt.sign(user, config.SECRETJWT, {
        expiresIn: "1h"
      });
      response.cookie("usercookie", token, {
        httpOnly: true
      });
      // Email Structure:
      let emailStructure = `<h2>Click on the following link to reset your password</h2>
      <a href="http://localhost:${config.PORT}/newPassword/${token}">Reset Password</a>`;
      // Send Email
      await emailTransport(user.email, "Resetting Password", emailStructure);

      response.setHeader("Content-Type", "text/html");
      response.status(200).json(`You will receive an email at ${user.email} to reset your password.`);
    } else {
      response.setHeader("Content-Type", "text/html");
      response.status(404).json({
        message: "The email is not registered. Please validate your input and try again."
      });
    }
  } catch (error) {
    response.setHeader("Content-Type", "application/json");
    response.status(500).json({
      Error: "Error 500 - Unexpected Error."
    });
  }
};

export const getValidateNewPassword = async (request, response) => {
  let {
    password,
    token
  } = request.body;

  if (!token) {
    response.setHeader("Content-Type", "application/json");
    return response.status(400).json({
      error: "Invalid or missing token."
    });
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, config.SECRETJWT);
  } catch (error) {
    response.setHeader("Content-Type", "application/json");
    return response.status(400).json({
      error: "Invalid or expired token."
    });
  }

  let id = decodedToken._id;

  try {
    if (!validatePassword(password, decodedToken.password)) {
      logger.debug("Password different, it may be hashed and saved");
      let hashedPassword = generateHash(password);
      logger.debug(`Password = ${password} Hashed = ${hashedPassword}`);
      let result = await UserService.updatePassword(id, hashedPassword);
      response.setHeader("Content-Type", "application/json");
      response.status(200).json(result);
    } else {
      response.setHeader("Content-Type", "application/json");
      response.status(400).json({
        message: "The new password has to be different from the one previously set."
      });
    }
  } catch (error) {
    logger.error(`Error while updating password: ${error.message}`);
    response.setHeader("Content-Type", "application/json");
    return response.status(500).json({
      error: "Server error while updating user password."
    });
  }
};

export const updateUser = async (request, response) => {
  try {
    const uid = request.params.uid;
    const updatedUser = request.body;
    const upUser = await UserService.updateUser(uid, updatedUser);
    response.json({
      upUser
    });
  } catch (error) {
    response.status(404).json({
      error: error.message
    });
  }
};

export const uploadDocuments = async (request, response) => {
  try {
    const uid = request.params.uid;
    const documents = request.files; // Assuming `files` is used in the multer configuration
    const result = await UserService.uploadDocuments(uid, documents);
    response.json({
      message: "Documents uploaded successfully",
      result
    });
  } catch (error) {
    response.status(500).json({
      error: "Failed to upload documents"
    });
  }
};

export const upgradeToPremium = async (request, response) => {
  try {
    const uid = request.params.uid;
    const result = await UserService.upgradeToPremium(uid);
    response.json({
      message: "User upgraded to premium successfully",
      result
    });
  } catch (error) {
    response.status(400).json({
      error: error.message
    });
  }
};

export const deleteUser = async (request, response) => {
  try {
    const uid = request.params.uid;
    const userSession = request.session.user;

    if (!userSession || userSession.role !== 'admin') {
      return response.status(403).json({ error: "You are not authorized" });
    }

    const user = await UserService.getUserById(uid);
    if (!user) {
      return response.status(404).json({ error: "User not found." });
    }

    const dUser = await UserService.deleteUser(uid);
    response.json(dUser);
  } catch (error) {
    response.status(404).json({ error: error.message });
  }
};

export const deleteInactiveUsers = async (request, response) => {
  try {
    const minutes = 30; // Use 2 * 24 * 60 for 2 days in production
    const cutoffDate = new Date(Date.now() - minutes * 60 * 1000);

    const usersToDelete = await UserService.deleteInactiveUsers(cutoffDate);

    // Send email notifications
    for (const user of usersToDelete) {
      const emailStructure = `<h2>Your account has been deleted due to inactivity.</h2>`;
      await emailTransport(user.email, "Account Deletion Notice", emailStructure);
    }

    response.status(200).json({
      message: `${usersToDelete.length} users have been deleted due to inactivity.`,
    });
  } catch (error) {
    response.status(500).json({
      error: "Error deleting inactive users",
      detail: error.message,
    });
  }
};
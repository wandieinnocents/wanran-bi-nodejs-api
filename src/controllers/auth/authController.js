const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');
const { userSchemaValidation, userLoginSchemaValidation } = require('../../validations/user/userValidations');

//register user
const register = async (req, res) => {
    try {
        // Validate input
        const { username, email, created_by, updated_by, password } = await userSchemaValidation.validateAsync(req.body);

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            if (existingUser.username === username) {
                return unauthorizedResponse(res, {
                    message: "Username already in use"
                });
            }
            if (existingUser.email === email) {
                return unauthorizedResponse(res, {
                    message: "Email already in use"
                });
            }
        }

        // Hash password and create user
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const newUser = await User.create({ username, email, created_by, updated_by, password, password: hashedPassword });

        return createdResponse(res, {
            message: "User registered successfully",
            data: newUser
        });

    } catch (error) {
        console.log("Error in register:", error);
        // Handle validation errors
        if (error.isJoi) {
            return serverErrorResponse(res, {
                message: error.details[0].message
            });
        }

        // Handle other errors
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};


const login = async (req, res) => {
    // const { email, password } = req.body;

    const secret = process.env.TOKEN_SECRET;
    try {

        const { email, password } = await userLoginSchemaValidation.validateAsync(req.body);

        const user = await User.findOne({ email });
        if (!user) {
            return notFoundResponse(res, {
                message: "User not found",
            });
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return unauthorizedResponse(res, {
                message: "Invalid Password",
            });
        }

        // const token = jwt.sign({ email: user.email, username: user.username }, secret, {});
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            secret,
            { expiresIn: '10h' } // token expires in
        );

        console.log("Token generated:", token);
        return successResponse(res, {
            message: "Login successful",
            data: {
                token,
                user
            }
        });
    } catch (error) {
        console.log("Error in register:", error);
        // Handle validation errors
        if (error.isJoi) {
            return serverErrorResponse(res, {
                message: error.details[0].message
            });
        }

        // Handle other errors
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

const logout = (req, res) => {
    try {
        // res.cookie("token", "");
        res.clearCookie('token');
        return successResponse(res, {
            message: "User Logged out successfully"
        });
    } catch (error) {
        return serverErrorResponse(res, {
            message: "Error during logout",
            error: error.message
        });
    }
};

module.exports = { register, login, logout };

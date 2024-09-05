import { Response } from "express";
import bcrypt from "bcrypt";
import userService from "../services/user.service";
import AuthService from "../services/auth.service";
import MailerService from "../services/mailer.service";
import User from ".prisma/client";


export const registerUser = async (req: any, res: Response) => {
  try {
    // here we get email for request body
    const { email, name } = req.body;

    // here we check if email is not provided
    if (!email || !name) {
      return res.status(400).json({
        message: "Email or Name is required"
      });
    }

    // here we check if email is not valid
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Email is not valid"
      });
    }

    console.log(email, name);

    // here we check if email is not already registered
    const user = await userService.findUserByEmail(email);
    if (user) {
      return res.status(400).json({
        message: "Cannot register with this email"
      });
    }

    /**
     * here we create new user in database
     */
    const newUser = await userService.createUser(email, name);
    if (!newUser) {
      return res.status(500).json({
        message: "Cannot register user"
      });
    }

    /**
     * here we create JWT token
     */
    const token = AuthService.generateToken(newUser);
    if (!token) {
      return res.status(500).json({
        message: "Cannot generate token"
      });
    }

    /**
     * here we prepare email template
     */
    const htmlMsg = await MailerService.mailTemplate(newUser, token);
    if (!htmlMsg) {
      return res.status(500).json({
        message: "Cannot generate email template"
      });
    }

    /**
     * here we send email
     */
    try {
        await MailerService.sendMail(newUser.email, "Activate your account", "some text", htmlMsg);
    } catch (error) {
        return res.status(500).json({
            message: "Cannot send email"
        });
    }

    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const authUser = async (req: any, res: Response) => {
    try {
        const token = req.query.token;
    
        if (!token) {
        return res.status(400).json({
            message: "Token is required"
        });
        }
    
        const userFromToken = AuthService.verifyToken(token);
        if (!userFromToken) {
        return res.status(400).json({
            message: "Invalid token"
        });
        }

        const user = userService.findUserByEmail(userFromToken.email);
        if (!user) {
            return res.status(400).json({
                message: "Cannot login this user."
            });
        }

        res.cookie('Authorisation', token, { 
            httpOnly: false,
            secure: false,
            maxAge: 3600000
        });
    
        return res.status(200).json({
        message: "User activated successfully"
        });
    } catch (error: any) {
        return res.status(500).json({
        message: "Internal server error",
        error: error.message
        });
    }
  };

export const loginUser = async (req: any, res: Response) => {
    try {
        const { email } = req.body;
    
        if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
        }
    
        const user = await userService.findUserByEmail(email);
        if (!user) {
        return res.status(400).json({
            message: "Cannot login this user."
        });
        }
    
        const token = AuthService.generateToken(user);
        if (!token) {
        return res.status(500).json({
            message: "Cannot generate token"
        });
        }
    
        /**
     * here we prepare email template
     */
    const htmlMsg = await MailerService.mailTemplateLogin(user, token);
    if (!htmlMsg) {
      return res.status(500).json({
        message: "Cannot generate email template"
      });
    }

    /**
     * here we send email
     */
    try {
        await MailerService.sendMail(user.email, "Activate your account", "some text", htmlMsg);
    } catch (error) {
        return res.status(500).json({
            message: "Cannot send email"
        });
    }
        
    
        return res.status(200).json({
        message: "User logged in successfully, email with auth sent"
        });
    } catch (error: any) {
        return res.status(500).json({
        message: "Internal server error",
        error: error.message
        });
    }
  };

  const SALT_ROUNDS = 10;

  export const registerWithPasswordUser = async (req: any, res: Response) => {
    const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      message: "Email is not valid"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await userService.createUserWithPassword(email, hashedPassword);
    if (!newUser) {
      return res.status(500).json({
        message: "Cannot register user"
      });
    }

    if (typeof newUser === "string") {
      return res.status(400).json({
        message: newUser
      });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser.id
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};


export const loginWithPasswordUser = async (req: any, res: Response) => {
  console.log("loginWithPasswordUser");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email or password is required"
    });
  }

  try {
    const userDbInst = await userService.findUserByEmail(email);
    console.log(userDbInst);
    if (!userDbInst) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    if (userDbInst.password === null) {
      return res.status(400).json({
        message: "User registered without password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userDbInst.password);
    console.log("is password valid", isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = AuthService.generateToken(userDbInst);
    if (!token) {
      return res.status(500).json({
        message: "Cannot generate token"
      });
    }
    
    res.cookie('Authorisation', token, { 
        httpOnly: false,
        secure: false,
        maxAge: 3600000
    });

    return res.status(200).json({
      message: "User logged in successfully"
      });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
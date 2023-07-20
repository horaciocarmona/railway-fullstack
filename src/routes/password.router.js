import { Router } from "express";
import {resetPassword,changePassword } from "../controllers/password.controller.js";
const routerPassword=Router()

// Ruta para manejar la solicitud de restablecimiento de contraseña
routerPassword.post('/reset',resetPassword) 
routerPassword.post('/change',changePassword) 

export default routerPassword;

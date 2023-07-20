import { Router } from 'express'
import { getUsers,getUserById,postDocumentsById,deleteUsers,getUserByEmail,updateUser,deleteUser} from "../controllers/user.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";
import multer from "multer";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('destinationfile ',file.fieldname)
      if (file.fieldname==="documents") {
        cb(null, "src/public/img/documents");
      } else {
          if (file.fieldname==="profiles") {
            cb(null, "src/public/img/profiles");
          } else {
            if (file.fieldname==="products") {
              console.log('fileproducts')
              cb(null, "src/public/img/products");
            }  
          }  
      }
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

const routerUsers = Router()
  
routerUsers.get('/', getUsers)
routerUsers.get("/:id",passportError('current'),authorization(['admin']),getUserById)
routerUsers.get("/email",passportError('current'),authorization(['admin']),getUserByEmail)
routerUsers.put('/:id',passportError('current'),authorization(['admin']), updateUser)
routerUsers.delete('/:id',passportError('current'),authorization(['admin']), deleteUser)
routerUsers.delete('/',passportError('current'),authorization(['admin']), deleteUsers)
routerUsers.post("/:uid/documents",passportError('current'),authorization(['admin']),upload.array("documents",30),postDocumentsById)
routerUsers.post("/:uid/profiles",passportError('current'),authorization(['admin']),upload.array("profiles",30),postDocumentsById)
routerUsers.post("/:uid/products",passportError('current'),authorization(['admin']),upload.array("products",30),postDocumentsById)

export default routerUsers

// import { Router } from "express";
// import { createUser, getUserById } from "../controllers/user.controller.js";
// import passport from "passport";

// const routerUser = Router()
// // routerUser.post("/", createUser)
// //routerUser.post("/register",passport.authenticate('register'),createUser)
// // routerUser.get("/registerJWT",passport.authenticate('jwt',{session:false},createUser))

// export default routerUser
import { Router } from "express";
import { getProducts,getProduct,deleteProduct,updateProduct,addProducts,postDocumentsById } from "../controllers/product.controller.js";
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

const routerProd = Router();

//EndPoint Traer un producto por id ruta\product
// routerSession.get('/current',passportError('current'),authorization('User'),(req,res)=>{
//     routerProd.get("/:id", getProduct);
// })
//EndPoint para traer un producto por id ruta\product
routerProd.get("/:id",getProduct);


//EndPoint borra producto por id ruta\product
routerProd.delete("/:id",passportError('current'),authorization(['admin','premium']), deleteProduct);

//EndPoint todos los productos ruta\product ad product
routerProd.get("/", getProducts) 

//EndPoint Dar de alta uno o varios productos ruta\product 
routerProd.post("/",passportError('current'),authorization(['admin','premium']), addProducts)

//EndPoint Modificar un producto ruta\product por id
routerProd.put("/:id",passportError('current'),authorization(['admin']), updateProduct)

routerProd.post("/:uid/documents",passportError('current'),authorization(['admin']),upload.array("products",30),postDocumentsById)

export default routerProd;

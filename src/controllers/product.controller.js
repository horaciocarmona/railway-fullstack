import { InstanceError } from "sequelize";
import { findProducts,findProductById,insertProducts,updateProductById,deleteProductById } from "../services/ProductServices.js";
import CustomError from "../helpers/middlewares/errors/CustomError.js";
import EErrors from "../helpers/middlewares/errors/enums.js"
import {generateProductErrorInfo} from "../helpers/middlewares/errors/info.js"
import {generateProductAddErrorInfo} from "../helpers/middlewares/errors/info.js"
//
export const getProducts = async (req,res) => {
    const {
      page = "1",
      limit = "10",
      sort = "0",
      category = "",
      title = "",
    } = req.query;
  //  const resultado=await getProducts()
    //  const resultado = await getProducts(
    //  parseInt(limit),
    //  parseInt(page),
    //   title,
    //   category,
    //   parseInt(ord)
    //  );
    let ord="0" 
    ord = !sort ? "0" : sort === "asc" ? "1" : "-1";
    // const pag = page != undefined ? page : 1
    // const limi = limit != undefined ? limit : 10
    // //    const ord = sort == "asc" ? 1 : -1
    try {
        const productos = await findProducts(parseInt(limit), parseInt(page),title,category, parseInt(ord))
        if (productos) {
            return res.status(200).send(productos)

//            return res.status(200).json(productos)
        }
        res.status(220).send({
            message: "Productos no encontrados"
        })

    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

export const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await findProductById(id);
        if (product) {
            return res.status(200).json(product)
        }
        return res.status(220).json({
            message: "Producto no encontrado"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const addProducts = async (req, res,next) => {
    const { title, description, code, price, status, stock, category} = req.body
    let owner=req.user.rol

    if (req.user.rol=="premium") {
         owner=req.user.email
    }
    //    console.log("owner",req.user)
    try {
        if (!title || !description || !code || !price || !status || !stock || !category )  {
            CustomError.createError({
            name:"Product add error",
            cause: generateProductAddErrorInfo({ title, description, code, price, status, stock, category}),
            message:"Error creation Product",
            code:EErrors.INVALID_TYPES_ERROR
          })
        }

        const product = await insertProducts([{ title, description, code, price, status, stock, category, owner }])
        if (product instanceof Error){
            return res.status(400).json({
                message: "Error en creacion de Producto"
            })

        } else {
            if (product){
                return res.status(200).json({
                message: "Producto dado de alta"
                })
            }
        }   
    } catch (error) {
        next(error)
        // return res.status(500).json({
        //     message: error.message
        // })
    }
}

export const updateProduct = async (req, res,next) => {
    const { id } = req.params
    const { title, description, code, price, status, stock, category, thumpbnail } = req.body
    try {
        if (!title || !description || !code || !price || !status || !stock || !category || !thumpbnail)  {
            CustomError.createError({
            name:"Product update error",
            cause: generateProductErrorInfo({ title, description, code, price, status, stock, category, thumpbnail }),
            message:"Error update Product",
            code:EErrors.INVALID_TYPES_ERROR
          })
        }
        if (req.user.rol=="premium") {
            const productSel = await findProductById(req.params.id)
            if (productSel && productSel.owner==req.user.email) {

            } else {
                return res.status(230).json({
                    message: "No tiene permisos para modificar este producto o no existe el producto "
                })
            }
        }    
        const product = await updateProductById(id, { title: title, description: description, code: code, price: price, status: status, stock: stock, category: category, thumpbnail: thumpbnail })

        if (product instanceof Error){
            return res.status(400).json({
                message: "Error en la actualizacion del servidor con el producto"
            })

        } else {
            if (product) {
                return res.status(200).json({
                      message: "Producto actualizado"
                })
            }
        } 

        return res.status(220).json({
            message: "Producto no encontrado"
        })

    } catch (error) {
        next(error)
        // return res.status(500).json({
        //     message: error.message
        // })
    }

}

export const deleteProduct = async (req, res) => {
    try {
        if (req.user.rol=="premium") {
            const productSel = await findProductById(req.params.id)
            if (productSel && productSel.owner==req.user.email) {
            } else {
                return res.status(230).json({
                    message: "No tiene permisos para anular este producto o no existe el producto "
                })
            }
        }    
        const product = await deleteProductById(req.params.id)
        if (product instanceof Error){
            return res.status(400).json({
                message: "Error en el servidor con la eliminacion del producto"
            })

        } else {
            if (product) {
                return res.status(200).json({
                    message: "Producto eliminado"
                })
            }
        } 
        return res.status(220).json({
            message: "Producto no encontrado"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

    
}

export const postDocumentsById = async (req, res) => {
    const { uid } = req.params
    if (!req.files) {
        return res.status(400).send('No se seleccionó ningún archivo.');
    }
    let documento={}
    req.files.forEach(file => { 
        // console.log('Nombre del archivo:', file.originalname);
        // console.log('Nombre del archivo en el servidor:', file.filename);
        // console.log('Tipo de archivo:', file.mimetype);
        // console.log('Tamaño del archivo:', file.size);
        // console.log('Ruta del archivo:', file.path);
        documento={name:file.filename,reference:file.path}
    }) 
    try {
       const productBDD = await findProductById(uid);
       if (productBDD instanceof Error) {
           req.logger.error(`Error en la coneccion a al base de datos ${productBDD}`);
           return res.status(400).json({
              message: "Error en coneccion a BDD: "+productBDD,
           });
       } else {
           if (productBDD) {
//                console.log('documents',documentos)
//                console.log('userbdd',userBDD)
                const userdate = await updateProductById(uid,
                    {
                     thumpbnail:"img/products/"+documento.name
                    }
                )  
  //              console.log('userdate',userdate)

                return res.status(200).json({message:"Imagen cargada"})
            }
            return res.status(200).json({
                 message: "Producto no encontrado"
            })
        }
    } catch (error) {
       return res.status(500).json({
           message: error
       })
     }
}

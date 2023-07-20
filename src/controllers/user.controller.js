import { findUsers,findUserById, updateUserById,deleteUserById,findUserByEmail } from "../services/UserServices.js";
import nodemailer from 'nodemailer'

export const getUsers = async (req, res) => {
    try {
        const users = await findUsers()
        const nuevaLista = users.map(objeto => {
            const nuevoObjeto = {last_name:objeto.last_name,first_name:objeto.first_name,email:objeto.email,rol:objeto.rol};
            return nuevoObjeto;
          });
          res.status(200).json(nuevaLista)

    } catch (error) {
        res.status(500).send(error)
    }

}

export const deleteUsers = async (req, res) => {
    try {
        const users = await findUsers()
        users.forEach(async objeto => {
            const fechaActual=new Date()    
            // Calcular la diferencia en milisegundos
            let diferenciaMs=0
            if (objeto.last_connection) {
                diferenciaMs = fechaActual - objeto.last_connection;
            } else {
                diferenciaMs = fechaActual - new Date(0);
            }    
                // Calcular la diferencia en días
            const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
//            console.log(objeto)
            if (diferenciaDias > 2) {
                 const transport=nodemailer.createTransport({
                    service:'gmail',
                    port: 587,
                    auth:{
                        user:'horacio.carmona@gmail.com',
                        pass:process.env.PASSWORDGMAIL
                    }
                 })
    
                  // Contenido del correo electrónico
                 const mailOptions = {
                     from: 'horacio.carmona@gmail.com',
                     to: objeto.email,
                     subject: 'Se dio de baja su cuenta por inactividad de mas de dos dias',
                     html: `<p> Se De baja la cuenta por inactividad:</p>`
                 };  
    
                // Envío del correo electrónico
                  transport.sendMail(mailOptions, (error, info) => {
                     if (error) {
                     } else {
                         req.logger.info( 
                         'Correo electrónico enviado: ' + info.response
                     )
                   }
                 }) 

                const userDelete = await deleteUserById(objeto._id.toString())            // Configuración de Nodemailer

                console.log('Han pasado más de dos días entre las fechas.');
            } else {
              console.log('No han pasado más de dos días entre las fechas.');
            }
        })
        res.status(200).json({message:'Se limpiaron los ususarios'})

    } catch (error) {
        res.status(500).send(error)
    }

}

// import  {ManagerUserMongoDB}  from "../dao/MongoDB/models/User.js";
// export const managerUser =  new ManagerUserMongoDB()

// export  const createUser = async (req, res) => {
//     console.log('entra al createruser')
//     res.status(200).send({status:'success', message:'User created'})
//     // res.redirect("/api/session/login")

// //         try {
// //          console.log('createuser')
// //          const { first_name, last_name, email, age, password } = req.body
// //          if (email) {
// //              console.log('getmanagerusers',await managerUser.getElementByEmail())
// //              const user = await managerUser.getElementByEmail(email)
// //              console.log('getelementbyemail',user,email)
// //              if (user) {
// // //                 req.session.login=true                
// // //                 req.session.user=user    
// // //                 res.redirect("/api/session/login")
// //              } else {
// //                  const passwordHash=createHash(password)
// //                  console.log(passwordHash)
// //                  const userCreated=await managerUser.addElements([{ first_name:first_name, last_name:last_name, email:email, age:age, password:passwordHash}])
// // //                 req.session.login=true                
// // //                 req.session.user={
// // //                     first_name:first_name,
// // //                     last_name:last_name,
// // //                     email:email,
// // //                     age:age,
// // //                     password:passwordHash
// // //                 }    
// // //                 res.redirect("/api/session/login")
// //              }
// //          } else {
// //              return res.status(200).send({
// //                  message: "debe registarse"
// //                    })
// //          }
// //      } catch (error) {
// //          res.status(500).send({
// //              message: error.message
// //          })
// //      }
// }

 export const getUserById = async (req, res) => {
    const { id } = req.params
     try {
        const user = await findUserById(id);
        if (user instanceof Error) {
            req.logger.error(`Error en la coneccion a al base de datos ${user}`);
            return res.status(400).json({
              message: "Error en coneccion a BDD",
            });
        } else {
             if (user) {
                return res.status(200).json(user)
             }
             return res.status(200).json({
                 message: "Usuario no encontrado"
             })
        }            
     } catch (error) {
        return res.status(500).json({
            message: error
        })
      }
 }

 export const deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        const user = await deleteUserById(id);
        if (user instanceof Error) {
            req.logger.error(`Error en la coneccion a al base de datos ${user}`);
            return res.status(400).json({
              message: "Error en coneccion a BDD",
            });
        } else {
              if (user) {
                   return res.status(200).json({rol:user.rol,first_name:user.first_name,last_name:user.last_name,email:user.email,message:'se elimino el usuario'})
              }
              return res.status(200).json({
              message: "Usuario no encontrado"
              })
        }            
     } catch (error) {
        return res.status(500).json({
            message: error
        })
      }
 }

 export const getUserByEmail = async (req, res) => {
    const { email } = req.body
      try {
       const user = await findUserByEmail(email);
       if (user instanceof Error) {
           req.logger.error(`Error en la coneccion a al base de datos ${user}`);
           return res.status(400).json({
           message: "Error en coneccion a BDD",
        });
        } else {

            if (user) {
                return res.status(200).json(user)
            }
            return res.status(200).json({
            message: "Usuario no encontrado"
            })
        }           
    } catch (error) {
       return res.status(500).json({
           message: error
       })
     }
}

 export const postDocumentsById = async (req, res) => {
    const { uid } = req.params
    if (!req.files) {
        return res.status(400).send('No se seleccionó ningún archivo.');
    }
    let documentos=[]
    req.files.forEach(file => { 
        // console.log('Nombre del archivo:', file.originalname);
        // console.log('Nombre del archivo en el servidor:', file.filename);
        // console.log('Tipo de archivo:', file.mimetype);
        // console.log('Tamaño del archivo:', file.size);
        // console.log('Ruta del archivo:', file.path);
        documentos.push({name:file.filename,reference:file.path})
    }) 
    try {
       const userBDD = await findUserById(uid);
       if (userBDD instanceof Error) {
           req.logger.error(`Error en la coneccion a al base de datos ${userBDD}`);
           return res.status(400).json({
              message: "Error en coneccion a BDD: "+userBDD,
           });
       } else {
           if (userBDD) {
//                console.log('documents',documentos)
//                console.log('userbdd',userBDD)
                const userdate = await updateUserById(uid,
                    {first_name:userBDD.first_name,
                     last_name:userBDD.last_name,
                     email:userBDD.email,
                     age:userBDD.age,
                     documents:documentos   
                    }
                )  
  //              console.log('userdate',userdate)

                return res.status(200).json({message:"Imagen cargada"})
            }
            return res.status(200).json({
                 message: "Usuario no encontrado"
            })
        }
    } catch (error) {
       return res.status(500).json({
           message: error
       })
     }
}

export const updateUser = async (req, res) => {
    const { id } = req.params
    const {rol} = req.body
//    console.log('updateuser',id,rol)
    try {
       const userBDD = await findUserById(id);
       if (userBDD instanceof Error) {
           req.logger.error(`Error en la coneccion a al base de datos ${userBDD}`);
           return res.status(400).json({
              message: "Error en coneccion a BDD: "+userBDD,
           });
       } else {
           if (userBDD) {
//                console.log('documents',documentos)
//                console.log('userbdd',userBDD)
                const userdate = await updateUserById(id,
                    {first_name:userBDD.first_name,
                     last_name:userBDD.last_name,
                     email:userBDD.email,
                     age:userBDD.age,
                     rol:rol   
                    }
                )  
                return res.status(200).json({rol:userdate.rol,first_name:userdate.first_name,last_name:userdate.last_name,email:userdate.email,message:"se actualizo"})
            }
            return res.status(200).json({
                 message: "Usuario no encontrado"
            })
        }
    } catch (error) {
       return res.status(500).json({
           message: error
       })
     }
}

// export const getUserByEmail = async (email) => {
        
//     try {
//         console.log('manageruser')
//         const user = await managerUser.getElementByEmail(email)
//         if (user) {
//             return user
//         }
//         return 'usuario no encontrado' 
//      } catch (error) {
//         return error
//     }
// }



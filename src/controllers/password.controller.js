import {generateResetToken,isTokenExpired} from "../services/PasswordServices.js";
import { findUserByEmail,updateUserById} from "../services/UserServices.js";
import { validatePassword, createHash } from "../utils/bcrypt.js";
import nodemailer from 'nodemailer'

export const resetPassword = async (req, res,next) => {
  try {
    const { email } = req.body;
    req.logger.info( 
      `reseteo password ${email}`
    )

    const userBDD = await findUserByEmail(email);

    if (userBDD) {
        // Generar token de restablecimiento de contraseña
        const token = generateResetToken(email);
  
        // Configuración de Nodemailer
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
           to: email,
           subject: 'Restablecer contraseña',
           html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="http://localhost:3000/resetpassword/${token}">Restablecer contraseña</a>`,
        };  
  
        // Envío del correo electrónico
        transport.sendMail(mailOptions, (error, info) => {
           if (error) {
              console.log(error);
              return res.status(500).send('Error al enviar el correo electrónico');
            } else {
                res.cookie("cookieRes", token, { httpOnly: true });
                req.logger.info( 
                    'Correo electrónico enviado: ' + info.response
                )
                res.status(201).json({ token });
//        return res.status(200).send('Correo electrónico enviado');
            }
        }) 
    } else {
      req.logger.info( 
        `el mail ${email} no esta registrado`
      )
      return res.status(500).json({
        message: `el mail ${email} no esta registrado`
      })
      
    }
  } catch(error){
    req.logger.error(`No se puede resetear la clave por ${error}`);
    next(error);
  }
} 


export const changePassword = async (req, res,next) => {
  try {
    req.logger.info( 
      `cambio de password  `
    )
    const { email,password,token } = req.body;
    if (token){
      if (isTokenExpired(token)){
        req.logger.info( 
          `el link de reseteo de clave ha expirado, ingrese al login y haga el reseteo para que se
          le envie el link de reseteo por correo`
        )
        return res.status(500).json({
          message: `el link de reseteo de clave ha expirado, ingrese al login y haga el reseteo para que se
          le envie el link de reseteo por correo`
        })
      } else {
        const userBDD = await findUserByEmail(email);
        if (userBDD) {
          if (validatePassword(password, userBDD.password)) {
            req.logger.info( 
              `debe ingresar otra clave distinta a la que tenia`
            )
            return res.status(200).json({
              message: `debe ingresar otra clave distinta a la que tenia`
            })

          } else {
             // regitro cambio de clave 
             const hashPassword = createHash(password);
             const user = await updateUserById(userBDD._id,
             {first_name:userBDD.first_name,
              last_name:userBDD.last_name,
              email:userBDD.email,
              age:userBDD.age,
              password: hashPassword,
             }
             )

             if (user instanceof Error){
                 return res.status(200).json({
                     message:`usuario no encontrado ${user}`
                 })
     
             } else {
                 if (user) {
                      req.logger.info( 
                        `se actualizo la clave del usuario`
                      )
                       return res.status(200).json({
                       message: "usuario actualizado"
                     })
                 }
             } 
     
             return res.status(200).json({
                 message: "Usuario no encontrado"
             })
    
        
          }
          // Generar token de restablecimiento de contraseña
      
        } else {
          req.logger.info( 
            `el mail ${email} no esta registrado`
          )
          return res.status(500).json({
            message: `el mail ${email} no esta registrado`
          })
        
        }
    

      }

    } 
  } catch(error){
    req.logger.error(`No se puede resetear la clave por ${error}`);
    next(error);
  }
} 

export const updatePassword = async (req, res,next) => {
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

      const product = await updateProductById(id, { title: title, description: description, code: code, price: price, status: status, stock: stock, category: category, thumpbnail: thumpbnail })

      if (product instanceof Error){
          return res.status(200).json({
              message: "Producto no encontrado"
          })

      } else {
          if (product) {
              return res.status(200).json({
                      message: "Producto actualizado"
              })
          }
      } 

      return res.status(200).json({
          message: "Producto no encontrado"
      })

  } catch (error) {
      next(error)
      // return res.status(500).json({
      //     message: error.message
      // })
  }

}

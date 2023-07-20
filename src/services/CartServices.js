import cartModel from "../models/MongoDB/CartModel.js";
import productModel from "../models/MongoDB/ProductModel.js";
import ticketModel from "../models/MongoDB/TicketModel.js";
import mongoose from "mongoose";
import nodemailer from 'nodemailer'
import { __dirname } from "../path.js";

export const findCartById = async (id) => {
  try {
    const elemento = await cartModel.findById(new mongoose.Types.ObjectId(id));
    return elemento;
  } catch (error) {
    return error;
  }
};

export const updateProductCartById = async (id, info) => {
  try {
    //      console.log(id,info)
    const mensaje = await cartModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      info
    );
    return mensaje;
  } catch (error) {
    return error;
  }
};

export const addCarts = async (elementos) => {
  try {
    const mensaje = await cartModel.insertMany(elementos);
    return mensaje;
  } catch (error) {
    return error;
  }
};

export const insertProductCart = async (id, idProd, cant) => {
  try {
    let cartId = new mongoose.Types.ObjectId(id);
    let prodId = new mongoose.Types.ObjectId(idProd);
    let carrito = await cartModel.findById(cartId);
    const product = carrito.products.find((product) =>
      new mongoose.Types.ObjectId(idProd).equals(product.prodId)
    );
    const nuevoProducts = carrito.products;
    if (product) {
      product.cant = cant;
    } else {
      const nuevoProducts = carrito.products.push({
        prodId: prodId,
        cant: cant,
      });
    }
    carrito.products = nuevoProducts;
    const respuesta = await cartModel.findByIdAndUpdate(cartId, carrito);
    return respuesta;
  } catch (error) {
    return error;
  }
}

export const findProductsCart = async () => {
  try {
    const respuesta = await cartModel.find().populate("products.prodId");
    return respuesta;
  } catch (error) {
    return error;
  }
};

export const deleteProductCartById = async (id, idProd) => {

  try {
    let cartId = new mongoose.Types.ObjectId(id);
    let carrito = await cartModel.findById(cartId);
    carrito.products.forEach(element => {
    });
    const resto = carrito.products.filter(
       (product) => (idProd!==product.prodId.toString())
    );
//    carrito.products = resto;
    const respuesta = await cartModel.findByIdAndUpdate(cartId,{products:resto});
    return respuesta;
  } catch (error) {
    return error;
  }
};

export const deleteAllProductsCartById = async (id) => {
  try {
    let cartId = new mongoose.Types.ObjectId(id);
    let carrito = await cartModel.findById(id);
    let mensaje = "";
    if (carrito) {
      carrito.products = [];
      const respuesta = await cartModel.findByIdAndUpdate(id, carrito);
      return respuesta;
    } else {
      return `no existe el carrito con id: ${req.params.cid} en la base de datos`;
    }
  } catch (error) {
    return error;
  }
};

export const addProductsCart = async (id, idProd, cant) => {
  try {
    let cartId = new mongoose.Types.ObjectId(id);
    let prodId = new mongoose.Types.ObjectId(idProd);
    let carrito = await cartModel.findById(cartId);
    const product = carrito.products.find((product) =>
      new mongoose.Types.ObjectId(idProd).equals(product.prodId)
    );
    const nuevoProducts = carrito.products;
    if (product) {
      product.cant = cant;
    } else {
      const nuevoProducts = carrito.products.push({
        prodId: prodId,
        cant: cant,
      });
    }
    carrito.products = nuevoProducts;
    const respuesta = await cartModel.findByIdAndUpdate(cartId, carrito);
    return respuesta;
  } catch (error) {
    return error;
  }
};

export const purchaseTicket = async (id, user) => {
  try {
    let importeTicket=0.00;
    let cartId = new mongoose.Types.ObjectId(id);
    let carrito= await cartModel.findById(cartId)
    // obtengo los precios de los productos del carrito
    const productsTicket = await findProductsCart();
    // calculo el importe del carrito y genero orden y carrito de productos no vendidos
    let cartProductsNotSales=carrito
    const ticketOrder=[];
    console.log("carrito adorder", carrito);
    // creo ticket con productos con stock y carrito no vendidos 
    for (const produ of productsTicket[0].products) {
    // carrito.forEach( produ => {
      const productBDD = await productModel.findById(new mongoose.Types.ObjectId(produ.prodId._id));
      if (productBDD) {
        if (productBDD.stock >= produ.cant) {
           ticketOrder.push(produ);
        }
      }
    }
    console.log("ticketorder",ticketOrder)
  

    // actualizo stock 
    if (ticketOrder.length > 0) {
      //Calculo importe del carrito
        importeTicket = ticketOrder.reduce(
           (total, produ) => total + produ.prodId.price * produ.cant,
          0
        );
        console.log("importeticket", importeTicket);
         // grabo la orden de compra  
        const buyOrder = await buyToCart(importeTicket, user)
        if (buyOrder) {
          await actustock(ticketOrder, user,cartId); 

          // Contenido del correo electrónico
          let textoEmail="<h2>Detalle</h2>"
          ticketOrder.forEach((produ)=>
              textoEmail=textoEmail+`<p> producto:${produ.prodId.title} unidades:${produ.cant} precio:${produ.prodId.price}</p>`
          )
          textoEmail=textoEmail+`<h2>Pago ${importeTicket}</h2>`

          console.log('textoemail',textoEmail)
          console.log("user", user);

          const transport=nodemailer.createTransport({
          service:'gmail',
          port: 587,
          auth:{
            user:'horacio.carmona@gmail.com',
            pass:process.env.PASSWORDGMAIL
          }
        })
        const mailOptions = {
          from: 'horacio.carmona@gmail.com',
          to: user.email,
          subject: 'Usted realizo una compra en Bartender HC',
          html:" <h1> Ticket </h1>"+
          "<img src='cid:imagenadjunta' width='100' height='100'/>"+
          textoEmail,
          attachments: [
             {
               filename: '1689797694819logobartender.png',
               path: `${__dirname}`+'/public/img/documents/1689797694819logobartender.png',
               cid: 'imagenadjunta'
             }
           ]          
        };  

      //  ticket.forEach((obj)=>{textoEmail+`<p> ${obj.prodId.tittle} </p>`;
      //  +`<p> ${obj.prodId.price} </p>`
      //  })     
      //  console.log('textoemail',textoEmail)

       // Envío del correo electrónico
        transport.sendMail(mailOptions, (error, info) => {
           if (error) {
              console.log('Error Correo electrónico enviado: ' + error)
        
           } else {
              console.log('Correo electrónico enviado: ')
           }
        }) 
            return ticketOrder
        } else {
            return null
        } 

    }  
    return ticketOrder
  } catch (error) {
    return error;
  }
}


const actustock = async (carrito) => {
  await carrito.forEach(async produ => {
    if (produ.prodId.stock >= produ.cant) {
      console.log("actiañozp stock de ",produ)
      const { title, description, code, price, status, stock, category, thumbnails } = produ.prodId
         let prodUpdate={ title: title, description: description, code: code, price: price, status: status, stock: stock, category: category, thumbnails: thumbnails }
         prodUpdate.stock-=produ.cant
         await productModel.findByIdAndUpdate(
          new mongoose.Types.ObjectId(produ.prodId._id),
           prodUpdate
         );
      }
  });
}

const buyToCart = async (amount, user) => {
  const ticket = {
    code: Date.now().toString(),
    purchase_datetime: Date.now(),
    amount: amount,
    purchaser: user.email,
  };
  const order = await ticketModel.insertMany(ticket);
  return order;
};


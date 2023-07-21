import {createContext,useState} from "react";
// import {doc,getFirestore,collection, getDocs,query,where,addDoc,updateDoc,writeBatch} from "firebase/firestore"

export const cartContext = createContext({
    cart:[],
    user:{},
    isInCart: ()=>{},
    addToCart: ()=>{},
    removeToCart: ()=>{},
    emptyToCart: ()=>{},
    getToCart: ()=>{},
    buyToCart: ()=>{},
    totalCantidadCarrito:0,
    totalImporteCarrito:0.00                                   

}) //Cree el contexto, que seria como la caja "global" (de momento vacia) que voy a compartir entre los componentes

export default function CartProvider ({children}) {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState({});
    const [totalCantidadCarrito, setTotalCantidadCarrito] = useState(0);
    const [totalImporteCarrito, setTotalImporteCarrito] = useState(0.00);
    const getFromCart=(id)=>{return cart.find(ord =>ord.id===id)};                                                                  
    const isInCart=(id) =>{ return id !== undefined ? getFromCart(id):undefined};
    const emptyToCart = () => {
        let cId="" 
        const token = document.cookie.slice(6);
        console.log("token",token)
        fetch(`http://localhost:8080/api/carts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            })
              .then(response => response.json())
              .then((data) => {
                 console.log('datagetcart',data)
                 if (data[0]._id.length > 0) {    
                     cId=data[0]._id
                     console.log("cid",cId)
                     fetch(`http://localhost:8080/api/carts/${cId}`, {
                         method: "DELETE",
                         headers: {
                             "Content-Type": "application/json",
                             'Authorization': `Bearer ${token}`
                         },
                     
                     })
                      .then(response => response.json())
                      .then((data) => {
                            console.log('prodcar',data)
                            if (data){    
                                setCart([]);
                                setTotalCantidadCarrito(0);  
                                setTotalImporteCarrito(0.00);  
                            } else {
                            }    
                      })
                       .catch((error) => {
                          console.log(error);
                      });
                 } else {
                     console.log(`no hay carrito error ${data.message}`)
                 }  
               
               })
               .catch((error) => {
                   console.log("error en getcarts ",error);
               });

    }

    const getToCart = () => {
        setCart([]);
        const token = document.cookie.slice(6);
        console.log("token",token);
        fetch(`http://localhost:8080/api/carts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        })
          .then(response => response.json())
          .then((data) => {
             console.log('datagetcart',data);
             let totalCantidadAlCarrito=0;  
             let totalImporteAlCarrito=0.00;  
             let cartAlCarrito=[];   
             if (data[0].products.length > 0) {    
                 data[0].products.forEach(obj => {
                    obj.prodId.stock-=obj.cant;  
                    cartAlCarrito.push({id:obj.prodId._id,cantidad:obj.cant,descripcionProducto:obj.prodId.title,precioVentaUnitario:obj.prodId.price,stockProducto:obj.prodId.stock,idDoc:obj.prodId.code});
                    totalCantidadAlCarrito+=obj.cant;  
                    totalImporteAlCarrito+=(obj.cant*obj.prodId.price);  
                    console.log("cart",cart);
                });
                setCart([...cartAlCarrito]);
                setTotalCantidadCarrito(totalCantidadAlCarrito);  
                setTotalImporteCarrito(totalImporteAlCarrito);  

            } else {
                 console.log(`no hay carrito error ${data.message}`)
             }  
           
           })
           .catch((error) => {
               console.log("error en getcarts ",error);
           });

    }

    const addToCart=(obj)=>{
        let cId="" 
        if (isInCart(obj.id) && obj.id){
            console.log("ya existe, ya existe");
            const productoExistente=getFromCart(obj.id); 
            productoExistente.cantidad+=obj.cantidad; 
            productoExistente.stockProducto-=obj.cantidad; 
            const token = document.cookie.slice(6);
            console.log("token",token)
            fetch(`http://localhost:8080/api/carts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            })
              .then(response => response.json())
              .then((data) => {
                 console.log('datagetcart',data)
                 if (data[0]._id.length > 0) {    
                     cId=data[0]._id
                     console.log("cid",cId)
                     fetch(`http://localhost:8080/api/carts/${cId}/products/${obj.id}`, {
                         method: "PUT",
                         headers: {
                             "Content-Type": "application/json",
                             'Authorization': `Bearer ${token}`
                         },
                         body: JSON.stringify({ cant:productoExistente.cantidad })
                     
                     })
                      .then(response => response.json())
                      .then((data) => {
                            console.log('prodcar',data)
                            if (data){    
                                obj.stockProducto-=obj.cantidad;  
                                setTotalCantidadCarrito(totalCantidadCarrito+obj.cantidad);  
                                setTotalImporteCarrito(totalImporteCarrito+(obj.cantidad*obj.precioVentaUnitario));  
                                console.log('cart',cart)
                                setCart([...cart]);
                            } else {
                            }    
                      })
                       .catch((error) => {
                          console.log(error);
                      });
                 } else {
                     console.log(`no hay carrito error ${data.message}`)
                 }  
               
               })
               .catch((error) => {
                   console.log("error en getcarts ",error);
               });
     
       } else {
           console.log("nuevo producto "+obj.descripcionProducto);
           const token = document.cookie.slice(6);
           console.log("token",token)
           fetch(`http://localhost:8080/api/carts`, {
           method: "GET",
           headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
           },
           })
             .then(response => response.json())
             .then((data) => {
                console.log('datagetcart',data)
                if (data[0]._id.length > 0) {    
                    cId=data[0]._id
                    console.log("cid",cId)
                    fetch(`http://localhost:8080/api/carts/${cId}/products/${obj.id}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                         'Authorization': `Bearer ${token}`
                    },
                        body: JSON.stringify({ cant:obj.cantidad })
                
                    })
                     .then(response => response.json())
                     .then((data) => {
                         console.log('prodcar',data)
                           if (data){    
                               obj.stockProducto-=obj.cantidad;  
                               setCart([...cart,obj]);
                               console.log("ingreso al carrito con stock"+obj.stockProducto)
                               setTotalCantidadCarrito(totalCantidadCarrito+obj.cantidad)  
                               setTotalImporteCarrito(totalImporteCarrito+(obj.cantidad*obj.precioVentaUnitario))  
                               console.log(totalCantidadCarrito)
                               console.log(totalImporteCarrito)
                           } else {
                           }     
                     })
                    .catch((error) => {
                         console.log(error);
                    });
                } else {
                   console.log(`no hay carrito error ${data.message}`)
                }  
          })
          .catch((error) => {
              console.log("error en getcarts ",error);
          });
        }
        //   if (cId.length > 0) {
        //        fetch(`http://localhost:8080/api/carts/${cId}/products/${obj.id}`, {
        //        method: "PUT",
        //        headers: {
        //            "Content-Type": "application/json",
        //            'Authorization': `Bearer ${token}`
        //        },
        //      })
        //       .then(response => response.json())
        //       .then((data) => {
        //           console.log('prodcar',data)
        //           if (data.rol){    
        //               obj.stockProducto-=obj.cantidad;  
        //               setCart([...cart,obj]);
        //               console.log("ingreso al carrito con stock"+obj.stockProducto)
        //               setTotalCantidadCarrito(totalCantidadCarrito+obj.cantidad)  
        //               setTotalImporteCarrito(totalImporteCarrito+(obj.cantidad*obj.precioVentaUnitario))  
        //               console.log(totalCantidadCarrito)
        //               console.log(totalImporteCarrito)
        //           } else {
        //           }    
        //      })
        //      .catch((error) => {
        //         console.log(error);
        //      });
        //   } else {
        //       console.log("no hay carrito")
        //   }  
    }

    const removeToCart=(obj)=>{
        let cId="" 
        if (isInCart(obj.id) && obj.id){
            console.log("existe, se elimina ");
            console.log(totalCantidadCarrito)
            console.log(obj.cantidad);
            const token = document.cookie.slice(6);
            console.log("token",token)
            fetch(`http://localhost:8080/api/carts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            })
              .then(response => response.json())
              .then((data) => {
                 console.log('datagetcart',data)
                 if (data[0]._id.length > 0) {    
                     cId=data[0]._id
                     console.log("cid",cId)
                     fetch(`http://localhost:8080/api/carts/${cId}/products/${obj.id}`, {
                         method: "DELETE",
                         headers: {
                             "Content-Type": "application/json",
                             'Authorization': `Bearer ${token}`
                         },
                     
                     })
                      .then(response => response.json())
                      .then((data) => {
                            console.log('delprodcar',data.payload)
                            if (data.payload._id){    
                                obj.stockProducto-=obj.cantidad;  
                                setTotalCantidadCarrito(totalCantidadCarrito-obj.cantidad)  
                                setTotalImporteCarrito(totalImporteCarrito-(obj.cantidad*obj.precioVentaUnitario))  
                                cart.map((producto,i) => (producto.id===obj.id ? cart.splice(i,1) : undefined ));  
                                setCart([...cart]);
                                // setTotalCantidadCarrito(totalCantidadCarrito+obj.cantidad);  
                                // setTotalImporteCarrito(totalImporteCarrito+(obj.cantidad*obj.precioVentaUnitario));  
                                // setCart([...cart]);


                            } else {
                                console.log('error delprodcar',data)
                            }    
                      })
                       .catch((error) => {
                          console.log(error);
                      });
                 } else {
                     console.log(`no hay carrito error ${data.message}`)
                 }  
               
               })
               .catch((error) => {
                   console.log("error en getcarts ",error);
               });
        }
    }

    const buyToCart=(cart)=>{
        // Actualizo ordenes y Stock 
        let cId="" 
        const token = document.cookie.slice(6);
        console.log("token",token)
        fetch(`http://localhost:8080/api/carts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        })
          .then(response => response.json())
          .then((data) => {
             console.log('datagetcart',data)
             if (data[0]._id.length > 0) {    
                 cId=data[0]._id
                 console.log("cid",cId)
                 fetch(`http://localhost:8080/api/carts/${cId}/purchase`, {
                     method: "POST",
                     headers: {
                         "Content-Type": "application/json",
                         'Authorization': `Bearer ${token}`
                     },
                     body: JSON.stringify({ user:user })
                 
                 })
                  .then(response => response.json())
                  .then((data) => {
                        console.log('realizo la compra',data)
                        if (data){    
                            emptyToCart();

                        } else {
                            console.log('se cancelo la compra',data)

                        }    
                  })
                   .catch((error) => {
                      console.log(error);
                  });
             } else {
                 console.log(`no hay carrito error ${data.message}`)
             }  
           
           })
           .catch((error) => {
               console.log("error en getcarts ",error);
           });

        // const order={
        //     buyer: {email:user.email,first_name:user.first_name,last_name:user.last_name,number:1},
        //     items:[...cart],
        //     total:totalImporteCarrito
        // }
        // const db=getFirestore();
        // const ordersCollections=collection(db,"ordersCollection");    
        console.log("order");
//        console.log(order);

        // addDoc(ordersCollections,order).then((id)=>{
        //      console.log(order);
        // })    
//        console.log("cart");
//        console.log(cart);
//        stockToItems(cart);
    }   

     const stockToItems=(cartItems)=>{
        console.log("cartitimens");
        console.log(cartItems)

        // const db=getFirestore();
        console.log("cartitimens");
        console.log(cartItems)

        cartItems.map((producto) =>{ 

            // const itemDoc=doc(db,"items",producto.idDoc);    
            console.log("itemdoc");
            // console.log(itemDoc)
    
            // updateDoc(itemDoc,{stockProducto:producto.stockProducto});
    
        });  
    }   

     return (
        <cartContext.Provider value={{cart,user,addToCart,isInCart,emptyToCart,getToCart,removeToCart,totalCantidadCarrito,totalImporteCarrito,getFromCart,buyToCart}}>
            {children}
        </cartContext.Provider>
    )
}


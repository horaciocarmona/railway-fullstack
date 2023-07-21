import "./itemDetail.scss"
import {useParams} from "react-router-dom"
import {useState,useEffect,useContext} from "react"
import {getProductoById} from "../../ApiRest/productosApi"
import ItemCount from "../itemDetail/ItemCount/ItemCount"
import { cartContext } from "../../../context/cartContext"

const ItemDetails=()=>{
    const [stock, setStock] = useState(0);
    const {addToCart}=useContext(cartContext);
    const {getFromCart}=useContext(cartContext);
    const subirAlCarrito=(obj)=>{
        addToCart({id:obj.id,cantidad:obj.cantidad,descripcionProducto:obj.nombre,precioVentaUnitario:obj.precio,stockProducto:obj.stockProducto,idDoc:obj.idDoc});
    } 
    const {idProducto}=useParams();
    const [item,setProducto]=useState([]);
    
    function handleOnAdd(cantidad){
        if (stock > 0) {
            console.log( `se agregaron unidades ${cantidad}`);
            item.cantidad=cantidad;
            subirAlCarrito(item);
        }
    }
    const getProducto = async() => {
        const producto = await getProductoById(idProducto);
        const productoExistente=getFromCart(idProducto); 
        setProducto(producto);
        if (productoExistente) {
            setStock(producto.stockProducto-productoExistente.cantidad)    
        } else {
            setStock(producto.stockProducto)    
        }

    }

    useEffect(()=>{
        getProducto();
        },[]);

    return(
        <div className="product-container">
            <>
            <h3>{item.nombre}</h3>
            <img src={item.imagen} width="100" height="200" alt="imagen Card"/>
            <p> Precio: {item.precio}</p>
            <p> Stock: {stock}</p>
            <p> Id: {item.id}</p>
            </>
            <ItemCount
                handleOnAdd={handleOnAdd}
                stockProducto={item.stockProducto}    
                stock={stock}
                setStock={setStock}
            />
            
        </div>
    )
}
export default ItemDetails;

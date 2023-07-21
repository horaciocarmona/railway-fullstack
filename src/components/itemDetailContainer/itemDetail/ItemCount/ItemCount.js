import * as React from 'react';
import Button from 'react-bootstrap/Button';
import "./ItemCount.scss";
import {Link} from "react-router-dom" 

export default function ItemCount({handleOnAdd,stockProducto,stock,setStock}) {
    const [numberCount,setNumberCount]=React.useState(0);
    const handleSumaCantidad=()=>{
//            let limite=stock-numberCount
            if (stock > 0) {
                setNumberCount(numberCount+1)
                setStock(stock-1)
            } else {
                 setNumberCount(numberCount)
                 setStock(stock)
            }
     };   
     const handleRestaCantidad=()=>{
        setNumberCount(numberCount-1);
        setStock(stock+1)
    }

     const handleConfirmar = () => { 
        handleOnAdd(numberCount)
    }
    
     return (
        <div>
            <p className='unidades'>
                unidades:
            </p>
            <Button onClick={handleSumaCantidad} className="btn btn-info btn-sm">
               +
            </Button>
                {numberCount} 
            <Button disabled={numberCount === 0 ? true:false} onClick={handleRestaCantidad} className="btn btn-danger btn-sm">
                -
            </Button>
            < Link to = {`/`}>
                <Button onClick={handleConfirmar}>continuar</Button>
            </Link>            
        </div>

    )

}


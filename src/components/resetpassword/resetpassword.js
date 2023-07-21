import { useState } from "react"
import { useRef } from "react"
import {useParams} from "react-router-dom"

export const ResetPassword = () => {
    const {token}=useParams();
    const [mensaje, setMensaje] = useState('')
    console.log("token",token)
    const datForm = useRef() //Crear una referencia para consultar los valoresa actuales del form

    const ResetForm = (e) => {
        let datosFormulario = new FormData(datForm.current) //Pasar de HTML a Objeto Iterable
        console.log('datosfor1',datosFormulario)
        datosFormulario.append('token',token)
        console.log('datosfor2',datosFormulario)

        const clienteReset = Object.fromEntries(datosFormulario) //Pasar de objeto iterable a objeto simple
        e.preventDefault()
        fetch('http://localhost:8080/api/password/change', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(clienteReset)
        })
        .then(response => response.json())
        .then((data) => {
            console.log("mensaje: ",data.message)
            setMensaje(data.message)

            //            document.cookieRes = `token=${data.token};expires=${data.token};path=/`
//            document.cookieRes = `token=${data.token};path=/`
        })
          .catch((error) => {
            console.log(error);
          });

    }
    
    return (
        <div className="container divForm" >
            <h3>Formulario de Cambio de Clave</h3>
            <form onSubmit={ResetForm} ref={datForm}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Nueva contraseña</label>
                    <input type="password" className="form-control" name="password" />
                </div>

                <button type="submit" className="btn btn-primary">Cambio de contraseña</button>
                <p>----------------------------------------------</p>    
                <p>Mensaje de respuesta: {mensaje}</p>

            </form>

        </div>
    )
}
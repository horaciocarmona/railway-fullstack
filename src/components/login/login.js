import { useRef } from "react"
import { useState } from "react"
//import { cartContext } from "../../../context/cartContext"

export const Login = () => {
    const [mensaje, setMensaje] = useState('')
    const [user, setUser] = useState({});

    const datForm = useRef() //Crear una referencia para consultar los valoresa actuales del form
    const datFormReset = useRef() //Crear una referencia para consultar los valoresa actuales del form

    const consultarForm = (e) => {
        //Consultar los datos del formulario
        e.preventDefault()
        const datosFormulario = new FormData(datForm.current) //Pasar de HTML a Objeto Iterable
        const cliente = Object.fromEntries(datosFormulario) //Pasar de objeto iterable a objeto simple
         fetch('http://localhost:8080/api/sessions/login', {
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(cliente)
         })
             .then(response => response.json())
             .then(data => {
                // duracion de 1 dia
                 document.cookie = `token=${data.token};expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()};path=/`
                 console.log(data.token)
                if (data.token){
                    setMensaje("ingreso correctamente")
                    setUser(JSON.stringify(cliente))
                }
        })
        .catch(error => {
            setUser({})
            setMensaje(`Error en ingreso ${error}`)
        })    
        console.log(cliente)
        e.target.reset() //Reset form
                    
    }

    const consultarResetForm = (e) => {
        const datosFormulario = new FormData(datFormReset.current) //Pasar de HTML a Objeto Iterable
        const clienteReset = Object.fromEntries(datosFormulario) //Pasar de objeto iterable a objeto simple
        e.preventDefault()
        fetch('http://localhost:8080/api/password/reset', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(clienteReset)
        })
        .then(response => response.json())
        .then((data) => {
            console.log("token",data.token)
            document.cookieRes = `token=${data.token};expires=${data.token};path=/`
            setMensaje("se le envio un link a su correo para que pueda ingresar")

        })
          .catch((error) => {
            setMensaje(`se produjo un error ${error}`)
            console.log(error);
          });
    };
    
    return (
        <div className="container divForm" >
            <h3>Formulario de login</h3>
            <form onSubmit={consultarForm} ref={datForm}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" name="password" />
                </div>
                <button type="submit" className="btn btn-primary">Ingresar</button>
            </form>
            <h3>Reseteo de clave</h3>
            <p>se le enviara un link para ingresar el cambio a su correo</p>
            <form onSubmit={consultarResetForm} ref={datFormReset}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" />
                </div>
                <button type="submit" className="btn btn-primary">Restaurar contraseña</button>
            </form>
            <p>----------------------------------------------</p>    
            <p>Mensaje de respuesta: {mensaje}</p>

        </div>
    )
}
import { useState } from "react"

export const Users= () => {
   const [mensaje, setMensaje] = useState('')
   // const [rol, setRol] = useState('')
   const [userId, setUserId] = useState('');
   const [role, setRole] = useState('');
   const [last_name, setLast_name] = useState('');
   const [first_name, setFirst_name] = useState('');
   const [email, setEmail] = useState('');

   const handleInputChange = (event) => {
       const { name, value } = event.target;
       setRole(''); // Actualizar el estado con el rol del usuario obtenido del backend
       setLast_name(''); // Actualizar el estado con el rol del usuario obtenido del backend
       setFirst_name(''); // Actualizar el estado con el rol del usuario obtenido del backend
       setEmail(''); // Actualizar el estado con el rol del usuario obtenido del backend
       setMensaje('')

       if (name === 'userId') {
          setUserId(value);
       } else if (name === 'role') {
             setRole(value);
       }
    }

    const updateUserRole = () => {
        const token = document.cookie.slice(6)
        fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify({ rol:role })
        })
        .then(response => response.json())
        .then((data) => {
            if (data.rol){    
                setRole(data.rol); // Actualizar el estado con el rol del usuario obtenido del backend
                setLast_name(data.last_name); // Actualizar el estado con el rol del usuario obtenido del backend
                setFirst_name(data.first_name); // Actualizar el estado con el rol del usuario obtenido del backend
                setEmail(data.email); // Actualizar el estado con el rol del usuario obtenido del backend
                setMensaje(`se actualizo el rol correctamente`)
            } else {
                setMensaje(`Error en actualizacion del rol ${data.message}`)
            }    
        })
        .catch(error => {setMensaje(`Error en ingreso ${error}`)
            console.log(`${userId}`)
//   e.target.reset() //Reset form
        })
    }    

    const getUserRole = () => {
        const token = document.cookie.slice(6)
        fetch(`http://localhost:8080/api/users/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`

            },
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            if (data.rol){    
                setRole(data.rol); // Actualizar el estado con el rol del usuario obtenido del backend
                setLast_name(data.last_name); // Actualizar el estado con el rol del usuario obtenido del backend
                setFirst_name(data.first_name); // Actualizar el estado con el rol del usuario obtenido del backend
                setEmail(data.email); // Actualizar el estado con el rol del usuario obtenido del backend

                setMensaje(`se trajo el rol`)
            } else {
                setMensaje(`Error en ingreso ${data.message}`)
            }    
        })
      .catch((error) => {
        console.log(error);
        setMensaje(`Error en ingreso ${error}`)

    });
    };

    const deleteUser = () => {
        const token = document.cookie.slice(6)
        fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        })
           .then(response => response.json())
    .      then((data) => {
           console.log('data',data)
           if (data.rol){    
              setRole(data.rol); // Actualizar el estado con el rol del usuario obtenido del backend
              setLast_name(data.last_name); // Actualizar el estado con el rol del usuario obtenido del backend
              setFirst_name(data.first_name); // Actualizar el estado con el rol del usuario obtenido del backend
              setEmail(data.email); // Actualizar el estado con el rol del usuario obtenido del backend
              setMensaje(`se dio de baja al usuario`)
           } else {
                setMensaje(`Error en eliminacion ${data.message}`)
           }    
        })
        .catch((error) => {
           setMensaje(`Error en ingreso ${error}`)
           console.log(error);
        });
    }

    return (
      <div> 
          <h2>Modificar Rol de Usuario</h2>
          <div className="mb-2">
              <label htmlFor="userId" className="form-label">ID de Usuario: </label>
              <input type="text" name="userId" value={userId} onChange={handleInputChange} size="40" />
                <div>
                <p>Datos del Usuario</p>
                <p>******************************</p>
                <p>Rol: {role}</p>
                <p>Nombre: {first_name}</p>
                <p>Apellido: {last_name}</p>
                <p>Email: {email}</p>

                </div>
              <label htmlFor="role">Nuevo Rol: </label>
              <input type="text" name="role" value={role} onChange={handleInputChange} />
          </div>
          <button className="btn btn-primary" onClick={getUserRole}>Consultar Rol</button>
          <button className="btn btn-primary" onClick={updateUserRole}>Actualizar Rol</button>
          <button className="btn btn-primary" onClick={deleteUser}>Eliminar Usuario</button>
          <p>----------------------------------------------</p>    
          <p>Mensaje de respuesta: {mensaje}</p>

      </div>
    )
}

    // return (
    //     <div className="container divForm" >
    //         <h3> Consulta,Modificacion,Baja de Usuarios</h3>
    //         <form onSubmit={consultarForm} ref={datForm}>
    //             <div className="mb-3">
    //                 <label htmlFor="email" className="form-label">Email</label>
    //                 <input type="email" className="form-control" name="email" />
    //             </div>
    //             <button type="submit" className="btn btn-primary">buscar</button>
    //         </form>
    //         <form onSubmit={consultarResetForm} ref={datFormReset}>
    //             <div className="mb-3">
    //                 <label htmlFor="rol" className="form-label">Rol</label>
    //                 <input type="rol" className="form-control" name="rol" />
    //             </div>
    //             <button type="submit" className="btn btn-primary">Enviar Modificacion</button>
    //             <button type="submit" className="btn btn-primary">Eliminacion de Usuario</button>
    //         </form>
    //         <p>----------------------------------------------</p>    
    //         <p>Mensaje de respuesta: {mensaje}</p>
    //     </div>

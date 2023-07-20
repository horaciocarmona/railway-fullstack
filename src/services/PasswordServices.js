
export const generateResetToken = (email) => {
    const timestamp = Date.now()
    const token = Math.random().toString(36) + timestamp
    return token
}

export const isTokenExpired = (token) => {
    let timestamp = token.substring(token.length - 13)
    const elapsedTime = Date.now() - timestamp //Hora actual - hora de generacion del token
    const expirationTime = 60 * 60 * 1000
    console.log("token time", token)
    console.log("token time timestamp", timestamp)
     console.log("tiempo actual",Date.now())
    console.log("elpased time", elapsedTime)
    console.log("expiration time", expirationTime)

    return elapsedTime > expirationTime
}



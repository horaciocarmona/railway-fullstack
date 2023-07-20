import "src/dotenv/config";
import userModel from "../src/models/MongoDB/UserModel.js";
import connectionMongoose from "../src/db/mongoose.js";
import Assert from 'assert'
await connectionMongoose().then(connect=>console.log('mongoose conectado'))


// await mongoose.connect(`mongodb+srv://franciscopugh01:coderhouse@cluster0.xfhtyhn.mongodb.net/?retryWrites=true&w=majority`)
//     .then(() => console.log("DB is connected"))

const assert = Assert.strict

describe('Testing Users', () => { //Descripcion de mi test
    before(function () {
//        this.usersDao = new Users()
        this.userModel =  userModel
    })
    beforeEach(function () {
        this.timeout(6000000)
    })

    it('Consultar todos los usuarios de mi BDD', async function () { //Descripcion de la operacion
        const resultado = await this.userModel.find()
        assert.strictEqual(typeof resultado, 'object')
        //        assert.strictEqual(Array.isArray(resultado), true)
        //Ambito de ejecucion propio
    })

    it("Crear un nuevo usuario", async function () {
        const user = {
            first_name: "Pepe",
            last_name: "Perez",
            email: "pepp@pepp.com",
            password: "1234",
            age:20
        }
        const newUser = new this.userModel(user)
        const resultado=await newUser.save()
        assert.ok(resultado._id) //Reviso si se guardo correctamente el usuario
    })

    it("Consultar a un usuario dado su email", async function () {
        const email = "pepe@pepe.com"
        const user = await this.userModel({email:email})
        assert.strictEqual(typeof user, 'object')
    })
}) 
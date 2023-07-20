import { Schema, model } from 'mongoose'
import paginate from "mongoose-paginate-v2"

const userSchema = new Schema({
    first_name: {
        type: String,
        requered: true
    },
    last_name: {
        type: String,
        requered: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    age: {
        type: Number,
        requered: true
    },
    password: {
        type: String,
        requered: true
    },
    rol: {
        type: String,
        enum:['user','admin','premium'],
        default: "user"
    },
    id_Cart: {
        type: Schema.Types.ObjectId,
        ref: "carts"
    },
    documents: {
        type: [
          {
            name:{
              type: String
            },
            reference:{
              type: String
            },
          },
        ],
      },
      last_connection:{
        type:Date
      },      
})


userSchema.plugin(paginate)

const userModel = model("users", userSchema)

export default userModel
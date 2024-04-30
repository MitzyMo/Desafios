import mongoose from "mongoose"
    /*         
                    - Validate that the "code" field is not repeated and that all fields are mandatory. When adding it, it must be created with an auto-incrementable id. 
                    Each product it manages must have the following properties:
                    - id: Number/String (Your choice, the id is NOT sent from body, it is auto generated as we have seen from the first deliverables, ensuring that you will NEVER repeat ids in the file)
                    - title:String,
                    - description:String
                    - code:String (This can not be repeated).
                    - price:Number
                    - discountPercentage
                    - rating
                    - brand
                    - status:Boolean*
                    - stock:Number
                    - category:String
                    - thumbnails: Array of Strings containing the paths where the images referring to that product are stored.
                        *. title, description, code, price, status, stock, category, ARE REQUIRED. 
                        *. thumbnails, discountPercentage, rating, brand, images. NOT mandatory.
                    */
const collectionName = "products"
const productSchema = new mongoose.Schema(
    {
        title:{ type: String, required:[true, 'The product Name is mandatory']} ,
        description:{ type: String, required:[true, 'The Description is mandatory']} ,
        code:{ type: String, required:[true, 'The Code is mandatory and must be unique'], unique:true} ,
        price:{ type: Number, required:[true, 'The Price is mandatory']} ,
        discountPercentage: Number,
        rating: Number,
        status:{ type: Boolean, required:[true, 'The Status is mandatory']} ,
        stock:{ type: Number, required:[true, 'The Stock is mandatory']} ,
        brand: String,
        category:{ type: String, required:[true, 'The Category is mandatory']} ,
        thumbnail: [{ img: { type: String } }],
        images: [{ img: { type: String } }]
    },
    {
        timestamps: true, 
    }
)

export const productModel=mongoose.model(
    collectionName,
    productSchema
)
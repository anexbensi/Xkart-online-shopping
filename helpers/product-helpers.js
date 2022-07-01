var db = require('../config/connection')
var collection= require('../config/collections')
const { PRODUCT_COLLECTION } = require('../config/collections')
const { ObjectId } = require('mongodb')
var objectId= require('mongodb').ObjectId

module.exports={

    addProduct:(product,callback)=>{
        console.log(product)

        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.insertedId)

        })
    },
    
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })

    },
    delProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).remove({_id:ObjectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    }


}
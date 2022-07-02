var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { USER_COLLECTION } = require('../config/collections')
const { ObjectId } = require('mongodb')
var objectId= require('mongodb').ObjectId



module.exports = {
    doSignUp: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((response)=>{
                resolve(response)
            })
            
            
        })




    },
    doLogin:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success")
                        response.user = userData
                        response.user.name=user.name
                        response.status=true 
                        resolve(response)

                    }
                    else{
                        console.log("login failed")
                        resolve(response)
                    }

                })
            }
            else{
                console.log("login failed")
                resolve(response)
            }
        })
    },
    addToCart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(userCart){
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:ObjectId(userId)},
                {
                        $push:{products:ObjectId(proId)}
                }
                ).then((response)=>{
                    resolve()
                })


            }
            else{
                let cartObj={
                    user:ObjectId(userId),
                    products:[ObjectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve(response)
                })
            }
        })

    }
    
}



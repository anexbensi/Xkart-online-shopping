var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { USER_COLLECTION } = require('../config/collections')



module.exports = {
    doSignUp: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData)
            
            
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
    
}



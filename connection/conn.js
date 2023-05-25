const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
async function getConnection(){
    await mongoose.connect(process.env.db_url)
    .then(()=>{
        console.log("database connected successfully");
    }).catch(e=>console.log(e));  
    
}
module.exports = getConnection;
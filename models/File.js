const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
            type:String,
        }
});

// Post middleware
fileSchema.post("save", async function(doc){
    try{
        console.log("Document: ",doc);
        
        // Transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port:465,
            secure:true,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
            tls:{
                rejectUnauthorized: false,
            }
        });

        // Send Mail
        let info = await transporter.sendMail({
            from:'Shubham Lingayat',
            to:doc.email,
            subject:"New File Uploaded on Cloudinary",
            html:`<h2>Hello,</h2> <p>File Uploaded Successfully</p>`,
        });

        console.log("INFO: ", info);
    }
    catch(error){
        console.error(error);
    }
})

const File = mongoose.model("File", fileSchema);
module.exports = File;
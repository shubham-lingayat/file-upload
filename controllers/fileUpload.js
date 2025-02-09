const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

// localFileUpload -> Handler Function
exports.localFileUpload = async(req,res)=>{
    try{
        // fetch file
        const file = req.files.file;
        console.log("Upload File is: ",file);

        let path = __dirname + "/files/" + Date.now() + "." + `${file.name.split(".")[1]}`;
        console.log("Path: ",path);

        file.mv(path, (err)=>{
            console.log(err);
        });

        res.json({
            success:true,
            message:"Local File Uploaded Successfully",
        });
    }
    catch(error){
        console.log("Not able to add file on server");
        console.error(error);
    }
}

// Check file format is correct or not
function isFileTypeSupported(type, supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality){
    const options = {folder};
    
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Image Upload Handler
exports.imageUpload = async(req,res)=>{
    try{
        // Data Fetch
        const {name, email, tags} = req.body;
        console.log(name, email, tags);

        const file = req.files.imageFile;
        console.log(file);

        // Validation
        const supportedTypes = ["jpg", "jpeg", "png", "webp"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                status:false,
                message:"File Format not supported",
            })
        }
        console.log("file format is correct");
        if (!file.tempFilePath){
            return res.status(401).json({
                status:false,
                message:"File not found",
            })
        }
        // if file format is supported
        const response = await uploadFileToCloudinary(file, "FileUploadProject");
        console.log(response);
        console.log("response is received");

        // Store entry in DB
        const fileData = await File.create({
            name, tags, email, imageUrl:response.secure_url
        })

        res.status(200).json({
            success:true,
            url:response.secure_url,
            message:"Entry created successfully",
        })
    }
    catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
}

// Video Upload Handler
exports.videoUpload = async (req,res)=>{
    try{
        // Data fetching of request body
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;

        // Validation
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("File Type: ", fileType);

        // Todo: add upper limit upto 5 MB
        if (!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File Format not supported",
            })
        }
        console.log("Uploading to Cloudinary");
        const response = await uploadFileToCloudinary(file, "FileUploadProject");
        console.log(response);

        // make Entry in DB
        const fileData = await File.create({
            name, tags, email, imageUrl:response.secure_url,
        });

        return res.status(200).json({
            success:true,
            Url:response.secure_url,
            message:"Entry Created Successfully."
        })

    }
    catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Can't Upload Video File",
        });
    }
}

// imageSizeReducer

exports.imageSizeReducer = async (req,res) =>{
    try{
        // Data Fetch
        const {name, email, tags} = req.body;
        console.log(name, email, tags);

        const file = req.files.imageFile;
        console.log(file);

        // Validation
        const supportedTypes = ["jpg", "jpeg", "png", "webp"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                status:false,
                message:"File Format not supported",
            })
        }
        console.log("file format is correct");
        if (!file.tempFilePath){
            return res.status(401).json({
                status:false,
                message:"File not found",
            })
        }
        // if file format is supported
        // Add Quality value (0 to 100) -> 30
        const response = await uploadFileToCloudinary(file, "FileUploadProject", 30);
        console.log(response);
        console.log("response is received");

        // Store entry in DB
        const fileData = await File.create({
            name, tags, email, imageUrl:response.secure_url
        })

        res.status(200).json({
            success:true,
            url:response.secure_url,
            message:"Entry created successfully",
        })
    }
    catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
}
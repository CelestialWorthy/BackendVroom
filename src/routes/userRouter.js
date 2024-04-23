const userRouter = require("express").Router();
const { Console } = require("console");
const { signUp, setPreferences } = require("../controllers/userController");

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../Images')); // Absolute path to Images folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Filter for image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('Invalid Image File', false);
    }
};

// Multer middleware configuration
const uploads = multer ({storage, fileFilter});


userRouter.post("/signup", signUp);
userRouter.post("/preferences", setPreferences);

userRouter.post("/upload-image", uploads.single('image'), async (req, res) => {    
    try {
        // Check if user is authenticated
        // const { user } = req;
        // if (!user) return res.status(401).json({ success: false, message: 'Unauthorized access!' });
        console.log("upload img received")
        // Check if file is uploaded
        if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded!' });

        // Process the uploaded image - Here you can save the image path to the database or perform any other necessary actions
        
        res.status(200).json({ success: true, message: 'Image uploaded successfully!', imagePath: req.file.path });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image!' });
    }
});

// userRouter.delete("/offer", deleteOffer);
// userRouter.put("/profile", updateProfile);
// userRouter.get("/profile", getBuisnessProfile);
// userRouter.put("/offer", updateOffer);
// userRouter.get("/order/:order_id", getScannedOrder);

module.exports = { userRouter };

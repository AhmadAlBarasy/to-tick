const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../public/img'));
	},
	filename: (req, file, cb) => {
		cb(null, resolveFileName(file.originalname, req));
	}
});

const upload = multer({ storage: storage });

const resolveFileName = (name, req) => {
	if (req.url.startsWith('/profile')){
		const finalName = name.split('.');
    	finalName[0] = `${req.user._id}.`;
	    return finalName.join('');
	}
}

module.exports = upload;

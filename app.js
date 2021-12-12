const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

// routes
const auth = require('./routes/auth');
const users = require('./routes/users');
const posts = require('./routes/posts');

// env
const api = process.env.API_URL;
const PORT = process.env.PORT || 8088;

// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));

// connect to db
mongoose.connect(`mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@${process.env.DBSERVER}/${process.env.DB}`)
    .then(() => console.log('Database connected successfully...'))
    .catch((err) => console.log(err));

// routes
app.use(api, auth);
app.use(api, users);
app.use(api, posts);

// port
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));

////////////////////////////////////////////////////////////////////////////
// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, req.body.name);
//     },
// });
//
// // multer routes
// const upload = multer({storage: storage});
// app.use(`${api}/upload`, upload.single('file'), (req, res) => {
//     res.status(200).json('File has been uploaded.');
// });

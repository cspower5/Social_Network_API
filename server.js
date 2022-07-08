//Express
const express= require('express');
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//Mongoose
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/Social_Network_API', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('debug', true);

//Routes
app.use(require('./routes'));

//Listen to server
app.listen(PORT, () => {
    console.log((`Connected on localhost:${PORT}`))
});

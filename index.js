const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const dotenv = require('dotenv');

//Import Routes
const usersRoute = require('./routes/users');

dotenv.config();

const app = express();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.1dazt.mongodb.net/${process.env.MONGO_COLLECTION}?retryWrites=true&w=majority`;
const port = process.env.PORT || 3000;

app.use(express.json());

//Mongoose connection
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const connection = mongoose.connection;
connection.once("open", function() {
    console.log("Connected with MongoDB");
});

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//routes
app.get('/', (req, res) => {
    res.send('We are on home');
});
app.use('/users', usersRoute);

// Listening to the server
app.listen(port, () => {
    console.log(`Server is listening ${port}`);
})
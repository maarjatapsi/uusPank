const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const { RequestHeadersHaveCorrectContentType, RequestBodyIsValidJson, processTransactions } = require('./middlewares')
const yaml = require('yamljs');
const swaggerDocument = yaml.load('./docs/api.yaml');

dotenv.config();

const app = express();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.1dazt.mongodb.net/${process.env.MONGO_COLLECTION}?retryWrites=true&w=majority`;
const port = process.env.PORT || 3000;

//Mongoose connection
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const connection = mongoose.connection;
connection.once("open", function() {
    console.log("Connected with MongoDB");
});

app.use(RequestHeadersHaveCorrectContentType);
app.use(express.json());
app.use(RequestBodyIsValidJson)
app.use(express.urlencoded({extended: true})); // Parse request body if's key=and&value=pairs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Import Routes
const usersRoute = require('./routes/users');
const sessionsRoute = require('./routes/sessions');
const transactionsRoute = require('./routes/transactions');

//routes
app.get('/', (req, res) => {
    res.send('We are on home');
});
app.use('/users', usersRoute);
app.use('/sessions', sessionsRoute);
app.use('/transactions', transactionsRoute);

processTransactions();
// Listening to the server
app.listen(port, () => {
    console.log(`Server is listening ${port}`);
})
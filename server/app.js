require("dotenv").config()

const express = require('express');
const app = express();

const cors = require('cors');

const connectDB = require('./db/connect');
const PORT = process.env.PORT || 3000
;

const productsRouter = require('./route/productsRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/products', productsRouter);


app.listen((PORT), async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1);
    }
})
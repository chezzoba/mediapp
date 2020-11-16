const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to DB
connectDB();

const PORT = process.env.PORT || 3000;

// Init bodyparser
app.use(express.json({extended: false}));

app.get('/', (req, res) => {res.send('NodeApp Running')});

// Define Routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, () => console.log(`App Started on Port ${PORT}`));
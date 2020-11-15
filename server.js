const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {res.send('NodeApp Running')});

app.listen(PORT, () => console.log(`App Started on Port ${PORT}`));
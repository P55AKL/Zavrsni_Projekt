const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/game_shop').then(() => {
  console.log('Uspješno povezan s bazom podataka');
}).catch((err) => {
  console.error('Greška prilikom povezivanja s bazom podataka', err);
});


const game = mongoose.model('game', new mongoose.Schema({
  Platform: String,
  Price: String,
  Game: String
}, { collection: 'shop' }));

app.get('/shop', async (req, res) => {
  try {
    const shop = await game.find();
    res.json(shop); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server sluša na portu ${port}`);
});
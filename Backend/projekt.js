const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/game_shop').then(() => {
  console.log('Uspješno povezan s bazom podataka');
}).catch((err) => {
  console.error('Greška prilikom povezivanja s bazom podataka', err);
});


const Game = mongoose.model('Game', new mongoose.Schema({
  Platform: String,
  Price: String,
  Title: String
}, { collection: 'shop' }));

app.get('/shop', async (req, res) => {
  try {
    const shop = await Game.find();
    res.json(shop); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/shop', async (req, res) => {
  try {
    const { Platform,Price , Title } = req.body;
    const newGame = new Game({ Platform,Price , Title  });
    const saveGame = await newGame.save();
    res.status(201).json(saveGame);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/shop/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Platform,Price , Title } = req.body;
    const saveGame = await Game.findByIdAndUpdate(id, { Platform,Price , Title  }, { new: true });
    res.json(saveGame);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/shop/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Game.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server sluša na portu ${port}`);
});
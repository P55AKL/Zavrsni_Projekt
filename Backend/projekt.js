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

// Definiranje schema modela s poljem Votes
const GameSchema = new mongoose.Schema({
  Platform: String,
  Price: String,
  Title: String,
  Votes: { type: Number, default: 0 } // Dodavanje polja Votes u model igre
}, { collection: 'shop' });

const Game = mongoose.model('Game', GameSchema);

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
    const { Platform, Price, Title } = req.body;
    const newGame = new Game({ Platform, Price, Title });
    const saveGame = await newGame.save();
    res.status(201).json(saveGame);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/shop/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Platform, Price, Title } = req.body;
    const saveGame = await Game.findByIdAndUpdate(id, { Platform, Price, Title }, { new: true });
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

// Ruta za glasanje
app.put('/shop/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;

    // Pronalazimo igru po ID-u
    const game = await Game.findById(id);

    // Ako igra ne postoji, vraćamo 404 status
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Inkrementiramo broj glasova za igru
    game.Votes++;

    // Spremamo promjene u bazu podataka
    await game.save();

    // Vraćamo ažuriranu igru kao odgovor
    res.json(game);
  } catch (err) {
    // Ako se dogodi greška, vraćamo status 500 i poruku o greški
    res.status(500).json({ error: err.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server sluša na portu ${port}`);
});
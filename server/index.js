const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const pool = './db.js';
const queries = require('./queries');

const app = express();
const PORT = 5000;

// Use body-parser middleware to handle JSON requests
app.use(bodyParser.json());

// Serving static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));


app.get('/api/superhero/:id', (req, res) => {//this will be used to search by name
    const heroID = req.params.id;

    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });

        const superheroes = JSON.parse(data);
        const hero = superheroes.find(h => h.id === parseInt(heroID));

        if (hero) {
            res.json(hero);
        } else {
            res.status(404).json({ error: 'Hero not found' });
        }
    });
});


app.get('/api/powers/:id', (req, res) => {
    fs.readFile('superhero_info.json', 'utf8', (err, heroData) => {
        if (err) return res.status(500).json({ error: 'Failed to read superhero data' });

        const superheroes = JSON.parse(heroData);
        const superhero = superheroes.find(hero => hero.id.toString() === req.params.id);

        if (!superhero) return res.status(404).json({ error: 'Superhero not found' });

        fs.readFile('superhero_powers.json', 'utf8', (err, powersData) => {
            if (err) return res.status(500).json({ error: 'Failed to read powers data' });

            const powersList = JSON.parse(powersData);
            const heroPowers = powersList.find(hero => hero.hero_names === superhero.name);

            if (!heroPowers) return res.status(404).json({ error: 'Superhero powers not found' });

            const truePowers = Object.keys(heroPowers).filter(key => heroPowers[key] === "True");
            
            res.json({ powers: truePowers });
        });
    });
});

app.get('/api/publishers', (req, res) => {
    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });

        const superheroes = JSON.parse(data);
        const publishers = [...new Set(superheroes.map(hero => hero.Publisher))];

        res.json({ publishers });
    });
});

app.get('/api/search', (req, res) => {
    const { gender, publisher, alignment, n } = req.query;//query parameters

    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });

        let superheroes = JSON.parse(data);

        if (gender) {
            superheroes = superheroes.filter(hero => hero.Gender && hero.Gender.toLowerCase() === gender.toLowerCase());
        }

        if (publisher) {
            superheroes = superheroes.filter(hero => hero.Publisher && hero.Publisher.toLowerCase() === publisher.toLowerCase());
        }

        if (alignment) {
            superheroes = superheroes.filter(hero => hero.Alignment && hero.Alignment.toLowerCase() === alignment.toLowerCase());
        }

        const limitedSuperheroes = n ? superheroes.slice(0, parseInt(n)) : superheroes;

        res.json({ ids: limitedSuperheroes.map(hero => hero.id) });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
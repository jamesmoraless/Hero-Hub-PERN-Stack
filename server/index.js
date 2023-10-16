const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const pool = require('./db');
const queries = require('./queries');

const app = express();
const PORT = 5000;

// Use body-parser middleware to handle JSON requests
app.use(bodyParser.json());

// Serving static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));


function getHeroInfo(heroId){//will be used to GET heros by ID IN the JSON file
    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) return console.log( 'Failed to read data.');

        const superheroes = JSON.parse(data);
        const hero = superheroes.find(h => h.id === parseInt(heroId));
        

        if (hero) {
            return hero; //OR express.json(hero) //HERE we want to return hero object instead
        } else {
            console.log('Hero not found.');
        }
    });
}

function getHeroPowers(heroId){
    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) return console.log('Failed to read superhero data');

        const superheroes = JSON.parse(data);
        const hero = superheroes.find(h => h.id === parseInt(heroId));

        if (!hero) return console.log('Superhero not found');

        fs.readFile('superhero_powers.json', 'utf8', (err, powersData) => {
            if (err) return console.log('Failed to read powers data');

            const powersList = JSON.parse(powersData);
            const heroPowers = powersList.find(h => h.hero_names === hero.name);

            if (!heroPowers) return console.log('Superhero powers not found');

            const truePowers = Object.keys(heroPowers).filter(key => heroPowers[key] === "True");
            
            //res.json({ powers: truePowers });
            //return truePowers;
            console.log(truePowers);
        });
    });
}

app.get('/api/superhero/:id', (req, res) => {//this will be used to search by name MIGHT NOT BE USED
    const heroID = req.params.id;

    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });

        const superheroes = JSON.parse(data);
        const hero = superheroes.find(h => h.id === parseInt(heroID));
        console.log(hero);

        if (hero) {
            res.json(hero);
        } else {
            res.status(404).json({ error: 'Hero not found' });
        }
    });
});

app.get('/api/powers/:id', (req, res) => {//This return's a hero's powers by ID
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

app.get('/api/publishers', (req, res) => {//this returns all publishers
    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });

        const superheroes = JSON.parse(data);
        const publishers = [...new Set(superheroes.map(hero => hero.Publisher))];

        res.json({ publishers });
    });
});

app.get('/api/search', (req, res) => {//this is the search/filter endpoint using query parameters 
    const { gender, publisher, alignment, n } = req.query;//this will be directly in frontend

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

app.post('/api/superhero-list', async (req, res) => {//Create a new list with a given name
    const { listName, superheroIds } = req.body;
    
    try {
        await pool.query(queries.addList, [listName, superheroIds]);
        res.status(201).send('List created successfully');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error creating list');
    }
});

//To get the actual thing I am looking for: list.rows[0].superhero_ids
app.put('/api/superhero-list/:listName', async (req, res) => {//Save (or update) superhero IDs to a given list name
    const listName = req.params.listName;//I'll need the front end to encode this with a %20 for spaces
    const { superheroIds } = req.body;

    try {
        const list = await pool.query(queries.getList, [listName]);

        if (!list) {
            res.status(404).send('List not found');
            return;
        }

        await pool.query(queries.updateList, [superheroIds, listName]);
        res.send('List updated successfully');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error updating list');
    }
});
//get list id's given a list name 
app.get('/api/superhero-list/:listName', async (req, res) => { 
    const listName = req.params.listName;

    try {
        const list = await pool.query(queries.getList, [listName]);
        
        if (!list) {
            res.status(404).send('List not found');
            return;
        }

        //loop through list.rows[0].superhero_ids.length
        res.json(list.rows[0].superhero_ids);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error fetching list');
    }
});

//get names, information and powers from a list name 
app.get('/api/superhero-list-all/:listName', async (req, res) => {
    //Get superhero IDs for a given list 
    //this method returns the ids but I want it to return all information so match id to json file id's
    //then I can get the name of the found object along with other information and return that
    //then with that name, match it to the 
    //use getHeroInfo(heroId) and the return of that should be 
    const listName = req.params.listName;

    try {
        const list = await pool.query(queries.getList, [listName]);
        
        if (!list) {
            res.status(404).send('List not found');
            return;
        }
        for (let  i = 0; i <list.rows[0].superhero_ids.length; i++){
            getHeroInfo(list.rows[0].superhero_ids[i]);
            getHeroPowers(list.rows[0].superhero_ids[i]);
        }
        res.send("Succesfully found info");
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error fetching list');
    }
});

app.delete('/api/superhero-list/:listName', async (req, res) => {//Delete list with a given list name
    const listName = req.params.listName;

    try {
        const result = await pool.query(queries.deleteList, [listName]);
        
        if (!result) {
            res.status(404).send('List not found');
            return;
        }
        res.send('List deleted succesfully');

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error deleting list');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
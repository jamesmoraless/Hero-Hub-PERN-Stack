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

app.get('/api/superhero/:id', (req, res) => {//GET: superhero_info for a given id; USED
    const heroID = req.params.id;

    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });

        const superheroes = JSON.parse(data);
        const hero = superheroes.find(h => h.id === parseInt(heroID));
        //console.log(hero);

        if (hero) {
            res.json(hero);//sends and ends request in JSON format
        } else {
            res.status(404).json({ error: 'Hero not found' });
        }
    });
});

app.get('/api/powers/:id', (req, res) => {//GET: superhero_powers for a given id; USED
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

app.get('/api/publishers', (req, res) => {//GET: all publishers 
    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });

        const superheroes = JSON.parse(data);
        const publishers = [...new Set(superheroes.map(hero => hero.Publisher))];

        res.json({ publishers });
    });
});

app.get('/api/search', (req, res) => { //GET: n number of matching hero id's by name, race, publisher, power; USED
    const { name, race, publisher, power, n } = req.query;

    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read superhero data' });
        }

        let superheroes = JSON.parse(data);

        if (name) {
            superheroes = superheroes.filter(hero => hero.name && hero.name.toLowerCase().includes(name.toLowerCase()));
        }

        if (race) {
            superheroes = superheroes.filter(hero => hero.Race && hero.Race.toLowerCase() === race.toLowerCase());
        }

        if (publisher) {
            superheroes = superheroes.filter(hero => hero.Publisher && hero.Publisher.toLowerCase() === publisher.toLowerCase());
        }

        fs.readFile('superhero_powers.json', 'utf8', (err, powersData) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to read superhero powers' });
            }

            let powers = JSON.parse(powersData);

            if (power) {
                superheroes = superheroes.filter(hero => {
                    let heroPowers = powers.find(p => p.hero_names === hero.name);
                    return heroPowers && heroPowers[power] === "True";
                });
            }

            // Convert the filtered superheroes array to an array of IDs only
            let superheroIds = superheroes.map(hero => hero.id);

            // Slicing the superhero IDs array based on n
            if (n) {
                superheroIds = superheroIds.slice(0, parseInt(n));
            }

            res.json(superheroIds);
        });
    });
});

app.post('/api/superhero-list', async (req, res) => {//Create a new list with a given name and superhero ID's; USED
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
app.put('/api/superhero-list/:listName', async (req, res) => {//Save/Update superhero IDs to a given list name; TOBE USED 
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
app.get('/api/superhero-list/:listName', async (req, res) => {//GET: id's from a list given the list name; UNUSED
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

app.get('/api/superhero-list-all/:listName', async (req, res) => {//GET: names, information and powers from a given list name; USED
    const listName = req.params.listName;

    try {
        const list = await pool.query(queries.getList, [listName]);
        
        if (!list || list.rowCount === 0) {
            res.status(404).send('List not found');
            return;
        }

        // Retrieve the IDs from the list
        const superheroIds = list.rows[0].superhero_ids; 

        // read superhero info
        fs.readFile('superhero_info.json', 'utf8', (err, superheroInfoData) => {
            if (err) {
                console.error('Error reading superhero info:', err);
                return res.status(500).send('Error reading superhero data');
            }

            const superheroes = JSON.parse(superheroInfoData);

            // Filter superheroes based on IDs from the list
            const filteredHeroes = superheroes.filter(hero => superheroIds.includes(hero.id));

            // read superhero powers
            fs.readFile('superhero_powers.json', 'utf8', (err, superheroPowersData) => {
                if (err) {
                    console.error('Error reading superhero powers:', err);
                    return res.status(500).send('Error reading superhero powers');
                }

                const powersList = JSON.parse(superheroPowersData);

                // Combine hero info with their powers
                const heroesWithPowers = filteredHeroes.map(hero => {
                    const heroPowers = powersList.find(p => p.hero_names === hero.name);
                    return {
                        ...hero,
                        powers: heroPowers ? Object.keys(heroPowers).filter(key => heroPowers[key] === "True") : []
                    };
                });

                // Send the combined data
                res.json({ heroes: heroesWithPowers });
            });
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error fetching list');
    }
});

app.delete('/api/superhero-list/:listName', async (req, res) => {//DELETE: list with a given list name
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

app.get('/api/all-superhero-lists', async (req, res) => {//USED to populate all hero lists (Additional get request)
    try {
        const result = await pool.query(queries.getAllListNames);
        //result.rows would be an array of list names
        res.json(result.rows.map(row => row.list_name));
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error fetching lists');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
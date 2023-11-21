const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const pool = require('./db');
const queries = require('./queries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');
require('dotenv').config();
//const {nanoid} = require('nanoid/non-secure');

const app = express();
const PORT = 5000;

// Use body-parser middleware to handle JSON requests
app.use(bodyParser.json());

// Serving static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

app.use(cors({
    origin: 'http://localhost:3000'//must update when the front-end is deployed
}));


  //authenticate the user (used in all methods)
  const authenticate = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, autorization failed.'});

    try{
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded.user;
      next();
    } catch (err){
      res.status(401).json({ message: 'Invalid token.'});
    }
  };

app.get('/', async (req, res) => {//should get this when opening the react app 
    res.send("Hey there");
});


app.post('/api/register', async (req, res) => {//Register New User
    if (!isEmail(req.body.email)) {
        return res.status(400).send('Invalid email format.');
    }

    try{
    const {email, password, nickname} = req.body;
    
    //check if email exists 
    const user = await pool.query(queries.checkEmailExists, [email]);    
    if (user.rows.length > 0){
        return res.status(400).json({ message : 'Email is already in use. Please choose another email.'});
      }
    
      //check if username exists
    const username = await pool.query(queries.checkNicknameExists, [nickname]);    
    if (username.rows.length > 0){
        return res.status(400).json({ message : 'Nickname is already in use. Please choose another nickname.'});
      }


    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //add user to db IF email does not exist 
    const newUser = await pool.query(queries.addUser, [email, hashedPassword, nickname]);
    res.status(201).json(newUser.rows[0]);//I want this to then send you to a new page that welcomes you 
    //and then allows you to have extra functionalities  
    
}catch (err){
      console.error(err.message);
      res.status(500).send('Server error.');
}
});

app.post('/api/login', async (req, res) => {//Login Existing User and return JWT
    try{
        const {email, password} = req.body; 
      
        //check if email exists 
        const user = await pool.query(queries.checkEmailExists, [email]); 
        if (user.rows.length === 0){
          return res.status(400).json({ message : 'Invalid Email. Try again.'});
        }

        // Check if account is disabled
        if (user.rows[0].isDisabled) {
            return res.status(403).send('Account is disabled. Please contact the site administrator.');
        }
      
        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid password. Try again.' });
        }
      
        // Generate and return JWT
        const payload = {
          user: {
          id: user.rows[0].id,
          nickname: user.rows[0].nickname,
          },
          };
          jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
          });} catch (err) {
          console.error(err.message);
          res.status(500).send('Server error.');
          }
});


app.post('/update-password', async (req, res) => {//Update Password
    // Verify user authentication
    // Allow them to update password
});


app.get('/api/open/search2.0', (req, res) => { //GET: n number of matching hero id's by name, race, publisher, power; USED
    const { name, race, publisher, power, n } = req.query;

    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: `Failed to read superhero data ${err.message}` });
        }

        let superheroes = JSON.parse(data);
        const formatString = (str) => str.trim().replace(/\s+/g, '').toLowerCase();


        if (name) {
            const formattedName = formatString(name);
            superheroes = superheroes.filter(hero => hero.name && formatString(hero.name).startsWith(formattedName));
        }

        if (race) {
            const formattedRace = formatString(race);
            superheroes = superheroes.filter(hero => hero.Race && formatString(hero.Race).startsWith(formattedRace));
        }

        if (publisher) {
            const formattedPublisher = formatString(publisher);
            superheroes = superheroes.filter(hero => hero.Publisher && formatString(hero.Publisher).startsWith(formattedPublisher));
        }

        // read superhero powers
        fs.readFile('superhero_powers.json', 'utf8', (err, superheroPowersData) => {
            if (err) {
                console.error('Error reading superhero powers:', err);
                return res.status(500).send('Error reading superhero powers');
            }

            const powersList = JSON.parse(superheroPowersData);

            // Combine hero info with their powers
            const heroesWithPowers = superheroes.map(hero => {
                const heroPowers = powersList.find(p => p.hero_names === hero.name);
                return {
                    ...hero,
                    powers: heroPowers ? Object.keys(heroPowers).filter(key => heroPowers[key] === "True") : []
                };
            });

            // Slicing the superhero IDs array based on n
            if (n) {
                finalheroes = heroesWithPowers.slice(0, parseInt(n));
            }

            // Send the combined data
            res.json({ heroes: finalheroes });
        });
    });
});


app.get('/api/open/public-hero-lists', async (req, res) => {//GET: public list info when opening the application; USED
    try {
        const publicLists = await pool.query(queries.getPublicHeroLists); // Query to fetch public lists

        const processedLists = publicLists.rows.map(list => {
            return {
                name: list.name,
                creatorNickname: list.nickname, 
                numberOfHeroes: list.superhero_ids.length,
                averageRating: list.average_rating, 
                lastModified: list.last_edited,
                description: list.description
            };
        }).sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)) // Sort by last modified date
          .slice(0, 10); // Limit to 10 lists

        res.json({ lists: processedLists });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error fetching public hero lists');
    }
});

app.get('/api/open/public-hero-lists/:listName', async (req, res) => {//GET: names, information and powers from a given list name; 
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


//AUTHENTICATION NEEDED FOR ENDPOINTS BELOW ----------------------------------------------------------------

app.post('/api/secure/superhero-list', authenticate, async (req, res) => {//Create a list with listName, IDs, description, visibility; AUTH USED
    const { listName, superheroIds, description, visibility } = req.body;
    const userID = req.user.id;
    //console.log(listName, superheroIds, description, visibility, userID);
    try {
        await pool.query(queries.addList, [listName, superheroIds, description, visibility, userID]);
        res.status(201).send('List created successfully');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error creating list');
    }
});

app.delete('/api/secure/superhero-list/:listName', authenticate, async (req, res) => {//DELETE: list with a given list name; AUTH USED
    const listName = req.params.listName;
    const userId = req.user.id; // Extracted from the authenticated user

    try {
        const list = await pool.query(queries.getListWithUserId, [listName]);

        if (!list || list.rows[0].length === 0) {
            res.status(404).send('List not found');
            return;
        }
         // Check if the authenticated user is the owner of the list
         if (list.rows[0].user_id !== userId) {
            return res.status(403).send('Unauthorized to update this list');
        }
        await pool.query("DELETE FROM reviews WHERE name = $1", [listName]);
        await pool.query(queries.deleteList, [listName]);

        res.send('List deleted succesfully');

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error deleting list');
    }
});


app.put('/api/secure/superhero-list/:listName', authenticate, async (req, res) => {//UPDATE: IDs, description, visibility given a list name; AUTH USED
    const listName = req.params.listName;
    const { superheroIds, description, visibility } = req.body;
    const userId = req.user.id; // Extracted from the authenticated user

    try {
        const list = await pool.query(queries.getListWithUserId, [listName]);

        if (!list || list.rows[0].length === 0) {
            return res.status(404).send('List not found');
        }

         // Check if the authenticated user is the owner of the list
        if (list.rows[0].user_id !== userId) {
            return res.status(403).send('Unauthorized to update this list');
        } 

        await pool.query(queries.updateList, [superheroIds, description, visibility, listName]);
        res.send('List updated successfully');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error updating list');
    }
})


app.post('/api/secure/reviews', authenticate, async (req, res) => {//CREATE: review of a listName with a rating and comment
    const { listName, rating, comment } = req.body;
    const userId = req.user.id; // Extracted from the authenticated user
    const nickname = req.user.nickname; // Extracted from the authenticated user

    try {
        // Check if list exists and is public
        const list = await pool.query(queries.getListWithUserId, [listName]);

        if (!list || list.rows[0].length === 0) {
            return res.status(404).send('List not found');
        }

        if (!list.rows[0].visibility) {
            return res.status(403).send('This list is private');
        }

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).send('Invalid rating');
        }

        // Insert review into the database
        await pool.query(queries.addReview, [listName, userId, rating, comment, nickname]);
        res.status(201).send('Review added successfully');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error adding review');
    }
});

app.get('/api/secure/my-hero-lists/:listName', authenticate, async (req, res) => {//GET: names, information and powers from a given list name; 
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

app.get('/api/secure/my-hero-lists', authenticate, async (req, res) => {//GET: my list info when opening the application; USED
    const userId = req.user.id; // Extracted from the authenticated user
    try {
        const myLists = await pool.query(queries.getMyHeroLists, [userId]); // Query to fetch public lists

        const processedLists = myLists.rows.map(list => {
            return {
                name: list.name,
                creatorNickname: list.nickname, 
                numberOfHeroes: list.superhero_ids.length,
                averageRating: list.average_rating, 
                lastModified: list.last_edited,
                description: list.description,
                visibility: list.visibility
            };
        }).sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)) // Sort by last modified date
          .slice(0, 10); // Limit to 10 lists

        res.json({ lists: processedLists });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error fetching public hero lists');
    }
});
//UNUSED ----------------------------------------------------------------------------------------------------

app.get('/api/superhero/:id', (req, res) => {//GET: superhero_info for a given id; 
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

app.get('/api/powers/:id', (req, res) => {//GET: superhero_powers for a given id; 
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


//get list id's given a list name 
app.get('/api/superhero-list/:listName', async (req, res) => {//GET: id's from a list given the list name; UNUSED
    const listName = req.params.listName;

    try {
        const list = await pool.query(queries.getList, [listName]);
        
        if (!list) {
            res.status(404).send('List not found');
            return;
        }

        res.json(list.rows[0].superhero_ids);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error fetching list');
    }
});


app.get('/api/search', (req, res) => { //GET: n number of matching hero id's by name, race, publisher, power; USED
    const { name, race, publisher, power, n } = req.query;

    fs.readFile('superhero_info.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: `Failed to read superhero data ${err.message}` });
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
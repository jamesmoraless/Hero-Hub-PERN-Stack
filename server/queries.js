//this file is used to seperate the queries with the controller methods since it would allow for ease of readability 
//and scalability when it comes to longer queries and more complexe APIs

//const getLinks = "SELECT long_url, short_id FROM links WHERE user_id = $1 GROUP BY long_url, short_id";
//const getOLinkByShort = "SELECT long_url FROM links WHERE short_id = $1";//$1 is the parameter passed into the query 
//const checkUsernameExists = "SELECT * FROM users WHERE username = $1";//alias for username 
//const addUser = "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *";//two arguments passed into the query
//const addLink = "INSERT INTO links (user_id, long_url, short_id) VALUES ($1, $2, $3) RETURNING *";//3 arguments passed and organised with a user_id 
const addList = "INSERT INTO superhero_lists (list_name, superhero_ids) VALUES ($1, $2) ON CONFLICT (list_name) DO NOTHING";
const updateList = "UPDATE superhero_lists SET superhero_ids = $1 WHERE list_name = $2";
const getList = "SELECT superhero_ids FROM superhero_lists WHERE list_name = $1";
const deleteList = "DELETE FROM superhero_lists WHERE list_name = $1"

module.exports = {
    addList,
    updateList,
    getList,
    deleteList,
}

//I'm at CREATE TABLE superhero_lists()
//\c webtech to connect to the db 
//I'm trying to decide w gpt about the db table creations and if the 
//methods are doing what i acc want 
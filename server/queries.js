//this file is used to seperate the queries with the controller methods since it would allow for ease of readability 
//and scalability when it comes to longer queries and more complexe APIs
//const getLinks = "SELECT long_url, COUNT(long_url) AS url_count FROM links WHERE user_id = $1 GROUP BY long_url";

const getLinks = "SELECT long_url, short_id FROM links WHERE user_id = $1 GROUP BY long_url, short_id";
const getOLinkByShort = "SELECT long_url FROM links WHERE short_id = $1";//$1 is the parameter passed into the query 
const checkUsernameExists = "SELECT * FROM users WHERE username = $1";//alias for username 
const addUser = "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *";//two arguments passed into the query
const addLink = "INSERT INTO links (user_id, long_url, short_id) VALUES ($1, $2, $3) RETURNING *";//3 arguments passed and organised with a user_id 

module.exports = {
    getLinks,
    getOLinkByShort,
    checkUsernameExists,
    addUser,
    addLink,
}
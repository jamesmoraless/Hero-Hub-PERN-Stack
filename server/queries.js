//this file is used to seperate the queries with the controller methods since it would allow for ease of readability 
//and scalability when it comes to longer queries and more complexe APIs
const addList = "INSERT INTO superhero_lists (list_name, superhero_ids) VALUES ($1, $2) ON CONFLICT (list_name) DO NOTHING";
const updateList = "UPDATE superhero_lists SET superhero_ids = $1 WHERE list_name = $2";
const getList = "SELECT superhero_ids FROM superhero_lists WHERE list_name = $1";
const deleteList = "DELETE FROM superhero_lists WHERE list_name = $1";
const getAllListNames = "SELECT list_name FROM superhero_lists";

const addUser = "INSERT INTO users (email, password, nickname) VALUES ($1, $2, $3) RETURNING *";
const checkEmailExists = "SELECT * FROM users WHERE email = $1"; 



module.exports = {
    addList,
    updateList,
    getList,
    deleteList,
    getAllListNames,
    addUser,
    checkEmailExists,
}

//\c webtech to connect to the db 
/* CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    isEmailVerified BOOLEAN DEFAULT FALSE,
    isDisabled BOOLEAN DEFAULT FALSE
);
 */



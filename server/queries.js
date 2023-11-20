//this file is used to seperate the queries with the controller methods since it would allow for ease of readability 
//and scalability when it comes to longer queries and more complexe APIs
const addList = "INSERT INTO hero_lists (name, superhero_ids, description, visibility, user_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (name) DO NOTHING";
const updateList = "UPDATE hero_lists SET superhero_ids = $1, description = $2, visibility = $3, last_edited = NOW() WHERE name = $4";
const getListWithUserId = "SELECT * FROM hero_lists WHERE name = $1";
const getList = "SELECT superhero_ids FROM hero_lists WHERE name = $1";
const deleteList = "DELETE FROM hero_lists WHERE name = $1";
const getAllListNames = "SELECT name FROM hero_lists";

const addUser = "INSERT INTO users (email, password, nickname) VALUES ($1, $2, $3) RETURNING *";
const checkEmailExists = "SELECT * FROM users WHERE email = $1"; 

const addReview = "INSERT INTO reviews (name, user_id, rating, comment, nickname) VALUES ($1, $2, $3, $4, $5)";

//const getPublicHeroLists = "SELECT * FROM hero_lists WHERE visibility = $1";
const getPublicHeroLists = `
    SELECT 
        hl.id, 
        hl.name, 
        hl.last_edited, 
        hl.description, 
        hl.superhero_ids,
        u.nickname, 
        ROUND(AVG(r.rating)::numeric, 1) AS average_rating
    FROM 
        hero_lists hl
        JOIN users u ON hl.user_id = u.id
        LEFT JOIN reviews r ON hl.name = r.name
    WHERE 
        hl.visibility = true
    GROUP BY 
        hl.id, u.nickname
    ORDER BY 
        hl.last_edited DESC
    LIMIT 10;
`;




module.exports = {
    addList,
    updateList,
    getList,
    deleteList,
    getAllListNames,
    addUser,
    checkEmailExists,
    getListWithUserId,
    addReview,
    getPublicHeroLists
}

//\c webtech to connect to the db 
/* CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) UNIQUE NOT NULL,
    isEmailVerified BOOLEAN DEFAULT FALSE,
    isDisabled BOOLEAN DEFAULT FALSE
);
 */


/* CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    user_id INTEGER REFERENCES users(id),
    nickname VARCHAR(255) REFERENCES users(nickname),
    name VARCHAR(255) REFERENCES hero_lists(name),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 
*/

/* CREATE TABLE hero_lists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    visibility BOOLEAN DEFAULT FALSE,
    superhero_ids jsonb NOT NULL,
    user_id INTEGER REFERENCES users(id),
    last_edited TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 
*/





const express = require('express');
const app = express();
//app.use(express.json()); //middleware that makes the request into a json object
//app.use(express.static("public")); //this middleware gets the static files in public folder and executes this before anything below
//app.use(cors({
//    origin: 'http://localhost:3000'//must update when the front-end is deployed
//}));


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => console.log(`its alive on http://localhost:${PORT}`)); //runs the API on a server defined by the port (port location, function)

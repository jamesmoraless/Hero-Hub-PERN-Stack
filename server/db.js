const Pool = require('pg').Pool;
//const dotenv = require('dotenv');

//dotenv.config();

const pool = new Pool({ connectionString: 'postgres://postgres:Williamandoraul1$@localhost:5433/webtech' });

module.exports = pool;

//process.on('exit', () => {
//    pool.end();
//  });
  
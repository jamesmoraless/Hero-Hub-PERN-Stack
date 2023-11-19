const Pool = require('pg').Pool;

const pool = new Pool({ connectionString: 'postgres://postgres:Williamandoraul1$@localhost:5433/webtech' });

module.exports = pool;

  
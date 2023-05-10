const Pool = require('pg').Pool
const pool = new Pool({
  user: 'my_user',
  host: 'localhost',
  database: 'my_database',
  password: 'postgres',
  port: 5432,
});

const getMerchants = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM merchants ORDER BY id ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}
const createMerchant = (body) => {
  return new Promise(function(resolve, reject) {
    const { name, email } = body
    pool.query('INSERT INTO public.merchants (name, email) VALUES ($1, $2) RETURNING *', [name,email], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new merchant has been added: ${name}`)
    })
  })
}
const deleteMerchant = (id) => {
  return new Promise(function(resolve, reject) {
    // const id = parseInt(request.params.id);
    pool.query('DELETE FROM public.merchants WHERE id = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`Merchant deleted with ID: ${id}`)
    })
  })
}

module.exports = {
  getMerchants,
  createMerchant,
  deleteMerchant,
}
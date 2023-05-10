const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'crowdfunding',
  password: 'admin',
  port: 5432,
});

const getUser = () => {
    return new Promise(function(reslove,reject) {
        pool.query('SELECT * FROM public."User" ORDER BY user_email ASC', (error,results) => {
            if(error) {
                reject(error)
            }
            reslove(results.rows);
        })
    })
}

const createUser = (body) => {
    return new Promise(function(resolve,reject) {
        const { user_email, user_password } = body
        pool.query('INSERT INTO public."User" (user_email, user_password) VALUES ($1, $2) RETURNING *',[user_email, user_password], (error, results) => {
            if(error) reject(error)
            resolve(`A new user has been added:${user_email}`)
        })
    })
}

const deleteUser = (id) => {
    return new Promise(function(resolve,reject) {
        pool.query('DELETE FROM public."User" WHERE user_id= $1',[id], (error,results)=> {
            if(error) reject(error)
            resolve(`User deleted with id: ${id}`)
        })
    })
}




module.exports = {
    getUser,
    createUser,
    deleteUser,
  }
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'crowdfunding',
    password: 'admin',
    port: 5432,
});


//id = user id
//pid = project id
//body = contains every fetched fields from form

//user id is used to get the projects per user
const getProjectByUser = (id) => {
    return new Promise(function (reslove, reject) {
        pool.query('SELECT project_id, project_name, project_desc FROM public."Project_Detail" WHERE user_email = (SELECT user_email FROM public."User" where user_id = $1)', [id], (error, results) => {
            if (error) {
                reject(error)
            }
            reslove(results.rows);
        })
    })
}


//we need user id for fetching user email to give the project user_email column so we can use it to fetch specifically for an user
const createProjectByUser = (id, body) => {
    return new Promise(function (resolve, reject) {
        const { project_name, project_id, project_desc } = body
        pool.query('INSERT INTO public."Project_Detail" (project_name, project_id, project_desc, user_email) VALUES ($1, $2, $3, (SELECT user_email FROM public."User" where user_id= $4)) RETURNING *', [project_name, project_id, project_desc, id], (error, results) => {
            if (error) reject(error)
            resolve(`A new project has been added to ${id} : ${project_name}`)
        })
    })
}


//requires user id to access project specified for user and project id to select correct project to delete
const deleteProjectByUser = (id, pid) => {
    return new Promise(function (resolve, reject) {
        pool.query('DELETE FROM public."Project_Detail" WHERE user_email = (SELECT user_email FROM public."User" where user_id= $1) and project_id = $2', [id, pid], (error, results) => {
            if (error) reject(error)
            resolve(`User deleted with id: ${id}`)
        })
    })
}

module.exports = {
    getProjectByUser,
    createProjectByUser,
    deleteProjectByUser,
}
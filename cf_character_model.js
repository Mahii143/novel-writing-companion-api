const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'crowdfunding',
  password: 'admin',
  port: 5432,
});

const getCharacterByUserProject = (id,pid) => {
    return new Promise(function (reslove, reject) {
        pool.query('SELECT * FROM public."Character" WHERE project_id = (SELECT project_id FROM public."Project_Detail" WHERE user_email = (SELECT user_email FROM public."User" WHERE user_id=$1) and project_id=$2)', [id,pid], (error, results) => {
            if (error) {
                reject(error)
            }
            reslove(results.rows);
        })
    })
}

const createCharacterByUserProject = (id,pid,crid,body) => {
    return new Promise(function (resolve, reject) {
        const { character_name, character_bio, character_physique, character_abilities, character_skills, character_equipements } = body;

        pool.query('INSERT INTO public."Character" (character_id, character_name, character_bio, character_physique, character_abilities, character_skills, character_equipements,project_id) VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT project_id FROM public."Project_Detail" WHERE project_id = $8 AND user_email = (SELECT user_email FROM public."User" where user_id = $9))) RETURNING *', [crid, character_name, character_bio, character_physique, character_abilities, character_skills, character_equipements, pid, id], (error, results) => {
            if (error) reject(error)
            resolve(results);
                //`A new chapter has been added to ${pid} : ${chapter_name}`)
        })
    })
}


const deleteCharacterByUserProject = (id, pid, crid) => {
    return new Promise(function (resolve, reject) {
        pool.query('DELETE FROM public."Character" WHERE character_id = (SELECT character_id FROM public."Character" WHERE project_id = (SELECT project_id FROM public."Project_Detail" WHERE project_id = $1 AND user_email = (SELECT user_email FROM public."User" WHERE user_id = $2)) AND character_id=$3)', [pid, id, crid], (error, results) => {
            if (error) reject(error)
            resolve(`Character deleted with id: ${crid}`)
        })
    })
}


module.exports = {
    getCharacterByUserProject,
    createCharacterByUserProject,
    deleteCharacterByUserProject,
}
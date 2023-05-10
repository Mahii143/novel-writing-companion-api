const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'crowdfunding',
  password: 'admin',
  port: 5432,
});

//returns all chapters not one specific
const getChapterByUserProject = (id,pid) => {
    return new Promise(function (reslove, reject) {
        pool.query('SELECT * FROM public."Chapter_Planned" WHERE project_id = (SELECT project_id FROM public."Project_Detail" where user_email = (SELECT user_email FROM public."User" where user_id=$1) and project_id=$2)', [id,pid], (error, results) => {
            if (error) {
                reject(error)
            }
            reslove(results.rows);
        })
    })
}


const createChapterByUserProject = (id,pid, body) => {
    return new Promise(function (resolve, reject) {
        const { chapter_key_figures, chapter_intro, chapter_scenary, chapter_climax, chapter_name, chapter_objective } = body;

        pool.query('INSERT INTO public."Chapter_Planned" (chapter_key_figures, chapter_intro, chapter_scenary, chapter_climax, chapter_name, chapter_objective, project_id) VALUES ($1, $2, $3, $4, $5, $6, (SELECT project_id FROM public."Project_Detail" WHERE project_id = $7 AND user_email = (SELECT user_email FROM public."User" where user_id = $8))) RETURNING *', [chapter_key_figures, chapter_intro, chapter_scenary, chapter_climax, chapter_name, chapter_objective, pid, id], (error, results) => {
            if (error) reject(error)
            resolve(results);
                //`A new chapter has been added to ${pid} : ${chapter_name}`)
        })
    })
}


const deleteChapterByUserProject = (id, pid, cid) => {
    return new Promise(function (resolve, reject) {
        pool.query('DELETE FROM public."Chapter_Planned" WHERE chapter_id = (SELECT chapter_id FROM public."Chapter_Planned" WHERE project_id = (SELECT project_id FROM public."Project_Detail" WHERE project_id = $1 AND user_email = (SELECT user_email FROM public."User" WHERE user_id = $2)) AND chapter_id=$3)', [pid, id, cid], (error, results) => {
            if (error) reject(error)
            resolve(`Chapter deleted with id: ${cid}`)
        })
    })
}


module.exports = {
    getChapterByUserProject,
    createChapterByUserProject,
    deleteChapterByUserProject,
}
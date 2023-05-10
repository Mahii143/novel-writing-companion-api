const express = require('express')
const app = express()
const port = 3001

const merchant_model = require('./merchant_model')
const cf_user_model = require('./cf_user_model')
const cf_project_model = require('./cf_project_model')
const cf_chapter_model = require('./cf_chapter_model')
const cf_character_model = require('./cf_character_model')

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

/********** get method starts **********/

//fetches all user
app.get('/auth', (req, res) => {
  // merchant_model.getMerchants()
  cf_user_model.getUser()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

//fetches all projects under one user with their id
app.get('/projects/:id', (req, res) => {
  // merchant_model.getMerchants()
  cf_project_model.getProjectByUser(req.params.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

app.get('/chapters/:id/:pid', (req, res) => {
  // merchant_model.getMerchants()
  cf_chapter_model.getChapterByUserProject(req.params.id,req.params.pid)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})


app.get('/characters/:id/:pid', (req, res) => {
  // merchant_model.getMerchants()
  cf_character_model.getCharacterByUserProject(req.params.id,req.params.pid)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

/********** get method ends **********/





/********** post method starts **********/

//post new user into db
app.post('/signup', (req, res) => {
  // merchant_model.createMerchant(req.body)
  cf_user_model.createUser(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

//post new project into db using user_id in params
app.post('/cprojects/:id', (req, res) => {
  // merchant_model.createMerchant(req.body)
  cf_project_model.createProjectByUser(req.params.id, req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

app.post('/projects/add_chapter/:id/:pid', (req, res) => {
  // merchant_model.createMerchant(req.body)
  cf_chapter_model.createChapterByUserProject(req.params.id, req.params.pid, req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

app.post('/projects/add_character/:id/:pid/:crid', (req, res) => {
  // merchant_model.createMerchant(req.body)
  cf_character_model.createCharacterByUserProject(req.params.id, req.params.pid, req.params.crid, req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

/********** post method ends **********/





/********** delete method starts **********/
app.delete('/signup/:id', (req, res) => {
  // merchant_model.deleteMerchant(req.params.id)
  cf_user_model.deleteUser(req.params.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})


//use the link dprojects/userid/projectid to delete a project created for an user
app.delete('/dprojects/:id/:pid', (req, res) => {
  // merchant_model.deleteMerchant(req.params.id)
  cf_project_model.deleteProjectByUser(req.params.id, req.params.pid)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

//use the link dprojects/userid/projectid to delete a project created for an user
app.delete('/dchapters/:id/:pid/:cid', (req, res) => {
  // merchant_model.deleteMerchant(req.params.id)
  cf_chapter_model.deleteChapterByUserProject(req.params.id, req.params.pid, req.params.cid)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})


app.delete('/dcharacters/:id/:pid/:crid', (req, res) => {
  // merchant_model.deleteMerchant(req.params.id)
  cf_character_model.deleteCharacterByUserProject(req.params.id, req.params.pid, req.params.crid)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

/********** delete method ends **********/



/*******port specified *********/
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
/*******port specified *********/



/***********************API Endpoints**********************

* -----------User---------------
* fetch all user - /auth
* create new user - /signup
* delete a user - /signup/:id
* ------------------------------
*
* -----------Projects-----------
* fetch all projects of an user - /projects/:id
* create new project for an user - /cprojects/:id
* delete a project of an user - /dprojects/:id/:pid
* ------------------------------
*
* -----------Chapters Planned-----------
* fetch all chapters of a project - /chapters/:id/:pid
* create new chapter for a project - /projects/add_chapter/:id/:pid => check for user before creating
* delete a chapter of a project - /dchapters/:id/:pid/:cid
* ------------------------------
*
* -----------Characters---------
* fetch all characters of a project - /characters/:id/:pid
* create new character for a project - /projects/add_character/:id/:pid/:crid
* delete a chapter of a project - /dcharacters/:id/:pid/:crid 
* ------------------------------

**********************API Endpoints***********************/


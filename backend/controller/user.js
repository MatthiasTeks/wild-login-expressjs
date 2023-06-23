const express = require('express');
const userModel = require('../model/user');
const { hashPassword, verifyPassword } = require('../middleware/auth.js');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
      const response = await userModel.getUser()
      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving users');
    }
});

router.post('/login', async (req, res) => {
  const { mail, password } = req.body;
  try {
    const [response] = await userModel.getUserByMail(mail)
    if(response){
      const verifyHash = await verifyPassword(response[0], password)
      if(verifyHash){
        res.status(200).send(verifyHash);
      } else {
        res.status(404).send('Password dont match')
      }
    } else {
      console.log('failed')
    }
  } catch(error) {
    console.error(error);
  } 
})

router.post('/create', hashPassword, async (req, res) => {
  const user = req.body;
  try {
      const response = await userModel.createUser(user);
      if(response){
          res.status(200).json(response);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error inserting user');
  }
});

module.exports = router;
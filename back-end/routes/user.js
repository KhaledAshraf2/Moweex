const express = require('express');
const { findById, findOne } = require('../models/user');
const User = require('../models/user');
const router = express.Router();

// LIST USERS
const filterFields = [
  'firstName',
  'lastName',
  'email',
  'birthdate',
  'createdAt',
];
router.get('/users', async (req, res) => {
  try {
    const { pageSize = 10, pageNumber = 1, order, orderBy } = req.query || {};
    console.log(req.query);
    const skip = (pageNumber - 1) * pageSize;

    const sortOrder = order ? { [orderBy]: order } : {};

    const filtersToApply = {};
    filterFields.forEach((field) => {
      if (req.query[field]) {
        if (field !== 'createdAt' && field !== 'birthdate') {
          filtersToApply[field] = new RegExp(`${req.query[field]}`);
        } else {
          console.log(new Date(req.query[field]).valueOf());
          filtersToApply[field] = {
            $gte: new Date(req.query[field]).valueOf(),
          };
        }
      }
    });
    console.log('newfilters', filtersToApply);

    // for (const filter of Object.entries(filters)) {
    //   const key = filter[0];
    //   const value = filter[1];
    //   if (key !== 'createdAt') {
    //     filtersToApply[key] = new RegExp(`${value}`);
    //   } else {
    //     filtersToApply[key] = { $gte: new Date(value * 1000) };
    //   }
    // }
    console.log(filtersToApply, sortOrder, skip, pageSize);
    const users = await User.find(filtersToApply)
      .sort(sortOrder)
      .skip(+skip)
      .limit(+pageSize);
    const count = await User.countDocuments(filtersToApply);

    res.status(200).send({ users, count });
  } catch (e) {
    res
      .status(500)
      .send({ userMessage: 'SOMETHING WENT WRONG', serverMessage: e });
  }
});

// UPDATE USER
router.patch('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { updatedUser } = req.body;
    console.log(userId, updatedUser);
    const currentUser = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
      runValidators: true,
    });
    res.send(currentUser);
  } catch (e) {
    res
      .status(500)
      .send({ userMessage: 'SOMETHING WENT WRONG', serverMessage: e });
  }
});

// DELETE USER
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(201).send('USER DELETED');
  } catch (e) {
    res
      .status(500)
      .send({ userMessage: 'SOMETHING WENT WRONG', serverMessage: e });
  }
});

// CREATE USER
router.post('/user', async (req, res) => {
  try {
    const { firstName, lastName, email, birthdate } = req.body;
    const newUser = new User({
      firstName,
      lastName,
      email,
      birthdate,
    });
    console.log(newUser);
    await newUser.save();
    res.status(201).send('USER CREATED');
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ userMessage: 'SOMETHING WENT WRONG', serverMessage: e });
  }
});

module.exports = router;

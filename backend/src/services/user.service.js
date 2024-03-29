const status = require('http-status');
const ApiError = require('../utils/ErrorHandler');
const { User } = require('../models');

const createUser = async (userDoc) => {
  if (await User.isEmailTaken(userDoc.email)) {
    throw new ApiError(status.BAD_REQUEST, 'Email already exists');
  }
  const user = await User.create(userDoc);
  console.log(user);
  return user;
};

const updateUser = async (userId, updateDoc) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
};

const getUserById = async (userId) => {
  return User.findById(userId);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserByUserName = async (userId) => {
  return User.findById(userId);
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found to delete');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUserById,
};

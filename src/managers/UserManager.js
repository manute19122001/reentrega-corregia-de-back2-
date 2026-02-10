const User = require('../models/user');

class UserManager {
  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }
}

module.exports = UserManager;

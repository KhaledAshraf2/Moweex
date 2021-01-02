const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    birthdate: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.statics.userCheck = async (id) => {
  const user = await User.findOne({ id });
  if (user) {
    throw new Error('User Already Exists');
  }
};

module.exports = mongoose.model('User', userSchema);

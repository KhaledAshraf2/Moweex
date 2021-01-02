const mongoose = require('mongoose');

const URI = 'mongodb+srv://Moweex:12341234@cluster0.mxfhv.mongodb.net/Moweex';

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected...');
  })
  .catch((e) => {
    console.log('MongoDB Connection Error: ', e);
  });

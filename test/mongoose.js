const mongoose = require("mongoose");

const teardownMongoose = async () => {
  // proper teardown of mongoose to prevent leaks
  await mongoose.disconnect();
};
module.exports = { teardownMongoose };

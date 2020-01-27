const fs = require("fs");

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync("./localhost.key"),
      cert: fs.readFileSync("./localhost.cert")
    }
  }
};

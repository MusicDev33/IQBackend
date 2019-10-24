require('dotenv').config();

if (process.env.NODE_ENV === 'DEVTEST') {
  module.exports = {
    database: 'mongodb://localhost:27017/devtest',
    secret: "$1358hbafbg@@",
    adminSecret: "O@M8N2d@1yvcXgI1y784"
  }
} else {
  module.exports = {
    database: 'mongodb://localhost:27017/iqtest',
    secret: "$1358hbafbg@@",
    adminSecret: "O@M8N2d@1yvcXgI1y784"
  }
}

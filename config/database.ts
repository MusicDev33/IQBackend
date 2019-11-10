import dotenv from 'dotenv';
dotenv.config();

let dbConfig: any;

if (process.env.NODE_ENV === 'DEVTEST') {
  dbConfig = {
    adminSecret: 'O@M8N2d@1yvcXgI1y784',
    database: 'mongodb://localhost:27017/devtest',
    secret: '$1358hbafbg@@'
  };
} else {
  dbConfig = {
    adminSecret: 'O@M8N2d@1yvcXgI1y784',
    database: 'mongodb://localhost:27017/iqtest',
    secret: '$1358hbafbg@@'
  };
}

export { dbConfig };

require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
 
module.exports = async(req, res, next) => {

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL+req.schema,
      },
    },
  });      
  req.connection = prisma; 
      next();
};

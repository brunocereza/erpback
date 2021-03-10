require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
 
module.exports = async(req, res, next) => {

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres:postgres@localhost:5432/newT?schema=public",
      },
    },
  });      
  req.connetion = prisma; 
      next();
};
require('dotenv').config({ path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');
const cookieParser = require('cookie-parser');

const server = createServer();

// use express middleware to hande cookies (JWT)
server.express.use(cookieParser());

// To do use express middleware to populate current user

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
    },
    },
    deets => {
        console.log(`Server is now runnning on port http:/localhost:${deets.port}`);
    }
);
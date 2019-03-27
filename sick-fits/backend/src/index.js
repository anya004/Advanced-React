require('dotenv').config({ path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const server = createServer();

// use express middleware to hande cookies (JWT)
server.express.use(cookieParser());

// To do use express middleware to populate current user
//decode the JWT 
server.express.use((req, res, next)=> {
    const { token } = req.cookies;
    if (token) {
        const {userId} = jwt.verify(token, process.env.APP_SECRET);
        // put the userId onto the req for the future requests to access
        req.userId = userId;
    }
    next();
});

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
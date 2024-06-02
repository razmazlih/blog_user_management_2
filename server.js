const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');

// Configure CORS
const corsOptions = {
    origin: 'https://razmazlih.github.io/', // Change this to your front-end origin
    credentials: true, // Enable cookies and other credentials
};

server.use(cors(corsOptions));
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.sendStatus(401);
        } else {
            next();
        }
    } else {
        next();
    }
});

server.use(router);
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});

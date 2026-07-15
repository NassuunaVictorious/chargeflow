import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';


// Load environment variables
dotenv.config();


// Import routes
import authRoutes from './routes/auth.js';
import stationRoutes from './routes/stations.js';
import reportRoutes from './routes/reports.js';


// Initialize Express
const app = express();

const httpServer = createServer(app);


// ================================
// SOCKET.IO
// ================================

const io = new Server(httpServer, {

cors: {
  origin: [
    'https://shiny-dodol-478d3b.netlify.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}
});


// Make socket available
app.set("io", io);



// ================================
// MIDDLEWARE
// ================================


app.use(cors({
  origin: [
    'https://shiny-dodol-478d3b.netlify.app',
    'http://localhost:5173'
  ],
  credentials: true
}));


app.use(express.json());

app.use(
    express.urlencoded({
        extended:true
    })
);



// ================================
// ROOT ROUTE
// ================================


app.get("/", (req,res)=>{

    res.json({

        message:
        "⚡ ChargeFlow Backend API is live",

        status:
        "running",

        version:
        "1.0.0"

    });

});



// ================================
// API ROUTES
// ================================


app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/stations",
    stationRoutes
);


app.use(
    "/api/reports",
    reportRoutes
);



// ================================
// HEALTH CHECK
// ================================


app.get("/api/health",(req,res)=>{

    res.json({

        status:"ok",

        database:
        mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",

        uptime:
        process.uptime(),

        timestamp:
        new Date().toISOString()

    });

});



// ================================
// SOCKET EVENTS
// ================================


io.on("connection",(socket)=>{


    console.log(
        `🔌 Client connected: ${socket.id}`
    );


    socket.on(
        "joinStation",
        (stationId)=>{

            socket.join(
                `station:${stationId}`
            );

        }
    );


    socket.on(
        "leaveStation",
        (stationId)=>{

            socket.leave(
                `station:${stationId}`
            );

        }
    );


    socket.on(
        "disconnect",
        ()=>{

            console.log(
                `🔌 Client disconnected: ${socket.id}`
            );

        }
    );


});



// ================================
// ERROR HANDLING
// ================================


app.use(
(err,req,res,next)=>{

    console.error(
        "Error:",
        err
    );


    res.status(
        err.status || 500
    )
    .json({

        message:
        err.message ||
        "Internal server error"

    });

});



// ================================
// UNKNOWN ROUTES
// ================================


app.use(
(req,res)=>{

    res.status(404)
    .json({

        message:
        `Route ${req.originalUrl} not found`

    });

});




// ================================
// DATABASE + SERVER
// ================================


const PORT =
process.env.PORT || 5000;


const MONGO_URI =
process.env.MONGO_URI;



if(!MONGO_URI){

    console.error(
        "❌ MONGO_URI missing"
    );

    process.exit(1);

}



mongoose.connect(MONGO_URI)

.then(()=>{


    console.log(
        "✅ Connected to MongoDB"
    );


    httpServer.listen(
        PORT,
        ()=>{


            console.log(
                `🚀 Server running on port ${PORT}`
            );


            console.log(
                `🌐 Client URL: ${process.env.CLIENT_URL}`
            );


        }
    );


})


.catch((error)=>{


    console.error(
        "❌ MongoDB connection error:",
        error.message
    );


    process.exit(1);


});
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config();
const authRouter = require('./routes/auth-routes')
const subjectRouter = require('./routes/subject-route')
const chapterRouter = require('./routes/chapter-routes')
const noteRouter = require('./routes/notes-routes')
const chatRouter = require('./routes/chat-routes')

mongoose.connect( process.env.MONGODB  
).then(()=>console.log('MongoDb connected')).catch(error=> console.log(error))

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_BASE_URL,             // your deployed frontend (Render)
  "http://localhost:5173"           // local dev frontend
];

app.use(
    cors({
        origin: allowedOrigins ,
        methods: ['GET','POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            'Express',
            'Pragma'

        ],
        credentials: true
    })
);

app.use(cookieParser())
app.use(express.json());

app.use('/api/auth', authRouter)
app.use('/api/subjects', subjectRouter);
app.use('/api/chapters', chapterRouter);
app.use('/api/notes', noteRouter);
app.use('/api/chats', chatRouter);

app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`))

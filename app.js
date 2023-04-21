// Import dependencies
import express from 'express';
import dotenv from 'dotenv';
import {join} from 'path'
import userRoutes from "./routes/userRoutes.js"
import connectDB from "./Database/connectdb.js";

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/Userdb"

// Database Connection:
connectDB(DATABASE_URL);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Template Engine:
app.set('view engine', 'ejs')

// Static Files:
app.use('/',express.static(join(process.cwd(), "Public")))

app.use(express.urlencoded({ extended: true }))

// Router Path:
app.use('/', userRoutes);

// Create port
const port = process.env.PORT

// Parse JSON request body
app.use(express.json());



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
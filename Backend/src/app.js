import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(
  cors({
    origin: "https://smart-delivery-management-system-frontend-5zys.onrender.com", // Replace with your frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes imports
import userRoutes from './routes/user.routes.js';
import dashboardRoutes from './routes/dashboardMatrics.routes.js';
import deliveryPartnerRoutes from './routes/deliveryPartner.routes.js';
import orderRoutes from './routes/order.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';


//routes declaration
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/partners', deliveryPartnerRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/assignments', assignmentRoutes);


export { app }

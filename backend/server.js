const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDb = require("./config/db")

connectDb();

const app = express();

app.use(cors());
app.use(express.json());

const userroutes = require("./routes/userRoutes");
const grouproutes = require("./routes/groupRoutes");
const expenseroutes = require("./routes/expenseRoutes");
const inviteRoutes = require('./routes/inviteRoutes');
const settleRoutes = require('./routes/settleRoutes');
const reminderRoutes = require('./routes/remindRoutes');
const activityRoutes = require('./routes/activityRoutes');


app.use('/api/users', userroutes);
app.use('/api/groups', grouproutes);
app.use('/api/expense', expenseroutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/settle', settleRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/activity', activityRoutes);

app.get('/',(req,res)=>{
    console.log("GET / route hit");
    res.send("Backend is running and connected to mongodb atlas");
});

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${port}`);
});
# 💸 FairFunds – Group Expense Tracker App

FairFunds is a modern full-stack web application that helps groups track shared expenses, split bills (equally or unequally), and settle up. Inspired by Splitwise but improved with smart UI and developer-friendly backend structure.

---

## 📊 Project Status

| Feature                          | Status         |
|----------------------------------|----------------|
| Individual Settle Up             | 🔄 In Progress  |
| Reflect Settlements in Group UI  | 🔄 In Progress  |
| Settle History / Reminders       | ⏳ Upcoming     |
---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router DOM
- CSS
- Axios
- JWT Decode

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (JSON Web Tokens)

---

⚙️ Setup Instructions

1. Clone the Repository

```bash
git clone https://github.com/your-username/fairfunds.git
cd fairfunds
```

2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

🚀 How It Works

- Users can register/login securely with JWT
- Create groups and invite members
- Add expenses with equal or unequal splits
- View who owes whom and settle up
- Balances are calculated in real-time
- All actions (add/edit/settle) are logged in activity

---

🔗 API Overview

Auth
- `POST /api/users/register`
- `POST /api/users/login`

Groups
- `GET /api/groups`
- `GET /api/groups/:groupId`
- `POST /api/groups`

Expenses
- `POST /api/expense/add`
- `PUT /api/expense/update/:expenseId`
- `GET /api/expense/group/:groupId`

Settlements
- `POST /api/settle/up`
- `GET /api/settle/group/:groupId`

---

🧩 Upcoming Features

- Settlement logs by date  
- Remind-to-settle notification system  
- Export group summaries as PDF  

---

👨‍💻 Author

**Aaditya Sarda**  
- GitHub: [aadityasarda](https://github.com/aadityasarda)  
- Email: adityasarda2004@google.com

---

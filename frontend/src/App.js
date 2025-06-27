import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupDetails from './pages/GroupDetails';
import CreateGroup from './pages/createGroup';
import MyInvites from './pages/MyInvites';
import ExpenseDetails from './pages/ExpenseDetails';
import Balances from './pages/Balances';

function App() {
  
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-invites" element={<MyInvites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/group/:groupId" element={<GroupDetails />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/expense/:id" element={<ExpenseDetails />} />
        <Route path="/balances" element={<Balances />} />

      </Routes>
    </Router>
  );
}

export default App;

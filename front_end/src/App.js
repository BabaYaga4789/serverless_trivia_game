import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import InviteUsers from './Components/InviteUsersPage/InviteUsersPage'
import UserRegister from './Components/register/userRegister';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from './firebaseConfig';
import Login from './Components/login/login';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/invite-users/:teamName" element={<InviteUsers />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

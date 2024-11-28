import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import HomePage from './HomePage';
import TaskPage from './pages/Task2/TaskPage';
import ManagerPage from './pages/ManagerPage/ManagerPage';
import NewAccountPage from './pages/NewAccount/NewAccount';
// import Wilderness from './Wilderness';
// import < NewAccountPage > from './pages/Task2/NewAccountPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/task" element={<TaskPage />} />
        <Route path="/manager" element={<ManagerPage />} />
        {/* <Route path="/newAccount" element={<NewAccountPage />} />
        <Route path="*" element={<Wilderness />} /> */}
        <Route path='/newAccount' element={<NewAccountPage />} />
      </Routes>
    </Router>
  );
}

export default App;
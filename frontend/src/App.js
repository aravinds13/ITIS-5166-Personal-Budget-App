import './App.css';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ModifyDataPage from './pages/ModifyDataPage/ModifyDataPage';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='mainContainer'>
        <Routes>
          <Route path='/' element= { <LoginPage/> }/>
          <Route path='/dashboard' element = { <DashboardPage/> }/>
          <Route path='modify' element = { <ModifyDataPage/> }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import FormCustomer from './components/FormCustomer';
import { Navbar1 } from './layout/NavBar';
import { HomeForm } from './components/HomeForm';
import { AddCustomer } from './components/AddCustomer';
import UserView from './components/UserView';

function App() {
  return (
    <Router>
      <main>
        <Navbar1 />
        <FormCustomer />
        <Routes>
          <Route path="/home-form" element={<HomeForm />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/users/:id" element={<UserView />} />
          {/* Other routes */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
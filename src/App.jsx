import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Users from './components/Users';
import Register from './components/Register';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />

        <main className="ml-16 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;

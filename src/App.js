import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './home/Home';
import Login from './pages/login';
import Register from './pages/register/Register';
import ClinicTable from './pages/clinics/ClinicTable';
import CreateUser from './components/CreateUser';
import PayTable from './pages/PayTable';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('tokenUser'));
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("tokenUser");
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("tokenUser"));
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {isAuthenticated ? (
        <Route path="/" element={<MainLayout handleLogout={handleLogout} />}>
          <Route path="/" element={<Navigate to="/clinics" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clinics" element={<ClinicTable />} />
          <Route path="/create_admin" element={<CreateUser />} />
          <Route path="/clinic_table" element={<PayTable />} />
          <Route path="*" element={<Navigate to="/clinics" />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default App;

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import MainLayout from './home/Home';
// import Login from './pages/login';
// import Register from './pages/register/Register';
// import ClinicTable from './pages/clinics/ClinicTable';
// import CreateUser from './components/CreateUser';

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('tokenUser'));

//   const handleLogout = () => {
//     localStorage.removeItem('tokenUser');
//     setIsAuthenticated(false);
//     window.location.href = '/login';
//   };

//   useEffect(() => {
//     setIsAuthenticated(!!localStorage.getItem('tokenUser'));
//   }, []);

//   console.log(isAuthenticated);

//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       {isAuthenticated ? (
//         <Route path="/" element={<MainLayout handleLogout={handleLogout} />}>
//           <Route path="/register" element={<Register />} />
//           <Route path="/clinics" element={<ClinicTable />} />
//           <Route path="/create_admin" element={<CreateUser />} />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Route>
//       ) : (
//         <Route path="*" element={<Navigate to="/login" />} />
//       )}
//     </Routes>
//   );
// };

// export default App;

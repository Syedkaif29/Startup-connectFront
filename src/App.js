import React from "react";
import { Provider } from 'react-redux';
import store from './store'; // Import the store
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar"; 
import Footer from "./components/common/Footer"; 
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} /> {/*src\pages\Home.js */}
          <Route path="/login" element={<Login />} /> {/*src\pages\Login.js */}
          <Route path="/register" element={<Register />} /> {/*src\pages\Register.js */}
          <Route path="/Navbar" element={<Navbar />} /> {/*src\components\common\Navbar.js */}
          <Route path="/Footer" element={<Footer />} /> {/*src\components\common\Footer.js */}
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;

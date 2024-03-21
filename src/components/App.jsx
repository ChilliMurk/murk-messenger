import React from "../index";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainPage from "./MainPage";
import Messenger from "./Messenger";
import '../styles/global.css';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/messenger" element={<Messenger />}  />
        </Routes>
      </Router>
  );
}

export default App;
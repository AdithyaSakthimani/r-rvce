// index.js
import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
// import HomePage from './HomePage';
import reportWebVitals from './reportWebVitals';
// import NoteState from './components/NoteState';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const NavFunc = () => {
  return (
    <>
     {/* <Navbar/> */}
      <div>
        <Routes>
          <Route path="/" element={<App/>} />
          {/* put the routes over here  */}
        </Routes>
      </div>
      {/* <Footer/> */}
    </>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <NoteState> */}
      <Router>
        <NavFunc />
      </Router>
    {/* </NoteState> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

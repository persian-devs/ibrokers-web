import "bootstrap/dist/css/bootstrap.css"
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Home } from "./Pages/Home"
import { Userlist } from "./Pages/Userlist"
import { Categori } from "./Pages/Categori"
import { Support } from "./Pages/Support"
import logolist from "./assets/img/logo-list.png";
import { Login } from "./Pages/Login";
import AddUser from "./Pages/Adduser";
import { getToken } from "./localstorage/token";

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const clearToken = () => {
    localStorage.removeItem(`${getToken}`);  
    navigate('/'); 
  };
  
  const handleClick = (index) => {
    if (index === 4) {
      clearToken(); 
    } else {
      setActiveIndex(index);
    }
  }

    return( 
    <>
      <div className="main">
        <Col className="content-left col-xl-10">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/userlist" element={<Userlist />} />
            <Route path="/categori" element={<Categori />} />
            <Route path="/support" element={<Support />} />
            <Route path="/" element={<Login />} />
            <Route path="/addtoGroup/:id" element={<AddUser />} />
          </Routes>
        </Col>
        <Col className="content-right ">
          <nav>
            <ul>
              <Link to="/home" className="link-nav-list">
                <li className={activeIndex === 0 ? 'active' : ''} onClick={() => handleClick(0)}><span className="icon-left">&lsaquo;</span>صفحه اصلی</li>
              </Link>
              <Link to="/userlist" className="link-nav-list"> 
                <li className={activeIndex === 1 ? 'active' : ''} onClick={() => handleClick(1)}><span className="icon-left">&lsaquo;</span>لیست کاربران</li>
              </Link>
              <Link to="/categori" className="link-nav-list">  
                <li className={activeIndex === 2 ? 'active' : ''} onClick={() => handleClick(2)}><span className="icon-left">&lsaquo;</span>دسته بندی ها</li>
              </Link>
              <Link to="/support" className="link-nav-list">
                <li className={activeIndex === 3 ? 'active' : ''} onClick={() => handleClick(3)}><span className="icon-left">&lsaquo;</span>پشتیبانی</li>
              </Link>
              <li className={activeIndex === 4 ? 'active' : ''} onClick={() => handleClick(4)}><span className="icon-left">&lsaquo;</span>خروج</li>
            </ul>
          </nav>
          
          <div className="row-logo">
            <div className="">
              <p> بــورس کـــــالـا</p>
            </div>
            <div className="">
              <img className="logolist" src={logolist}></img>
            </div>
          </div>
        </Col>
      </div>
    </>
  )
}

export default App;

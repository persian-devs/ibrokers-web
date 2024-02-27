import '../index.css';
import logoheader from "../assets/img/logo-header.png";
import alert from "../assets/img/Vector.png";
import { Offcanvas, Button } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getToken } from '../localstorage/token';

const Header = () =>{
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const handleOffcanvasToggle = () => setShowOffcanvas(!showOffcanvas);

    const handleCloseOffcanvas = () => {
        setShowOffcanvas(false);
    }

    const handleRemoveToken = () => {
        localStorage.removeItem(`${getToken}`);  
    }
    return(
        <>
        <div className="titr-home">
            <div className='header-r'>
                <button className='open-offcanvas' onClick={handleOffcanvasToggle}><FontAwesomeIcon icon={faList}/></button>
                <img className="img-header-home" src={logoheader}></img>
                <p>کارگزاری هوشمند رابین</p>
            </div>
            <div className='header-l'>
                <img className="alert-logo" src={alert}></img>
            </div>
        </div>

        <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className='offcanvas-title'>کارگزاری هوشمند رابین</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className='offcanvas-content'>
                <ul>
                    <li onClick={handleCloseOffcanvas}>
                        <Link to='/' className='link-to'>
                            <span>&lsaquo;</span>
                            <p>صفحه اصلی</p>
                        </Link>
                    </li>
                    <li onClick={handleCloseOffcanvas}>
                        <Link to='/userlist' className='link-to'>
                            <span>&lsaquo;</span>
                            <p>لیست کاربران</p>
                        </Link>
                    </li>
                    <li onClick={handleCloseOffcanvas}>
                        <Link to='/categori' className='link-to'>
                            <span>&lsaquo;</span>
                            <p>دسته بندی ها</p>
                        </Link>
                    </li>
                    <li onClick={handleCloseOffcanvas}>
                        <Link to='/support' className='link-to'>
                            <span>&lsaquo;</span>
                            <p>پشتیبانی</p>
                        </Link>
                    </li>
                    <li onClick={handleCloseOffcanvas}>
                        <Link to='/' className='link-to' onClick={handleRemoveToken} >
                            <span>&lsaquo;</span>
                            <p>خودرو</p>
                        </Link>
                    </li>
                </ul>
            </Offcanvas.Body>
        </Offcanvas>
        </>
    );
};

export default Header;
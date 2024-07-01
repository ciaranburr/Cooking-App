import React, {useState, useEffect} from 'react';
import { Button } from './Button';
import {Link} from 'react-router-dom';
import './navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

function Navbar() {
    const [click, setClick] = useState(false);
    const[button, setButton] = useState(true)

    const handleClick = () => setClick(!click);
    const closedMobileMenu = () => setClick(false);

    const showButton = () => {
      if(window.innerWidth <= 960) {
        setButton(false);
      } else{
        setButton(true);
      }
    };

    window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo'>
            Cook Now! <i className="fa-solid fa-kitchen-set icon-spacing"></i>
          </Link>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closedMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/suggestions' className='nav-links' onClick={closedMobileMenu}>
                Suggestions
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/food_list' className='nav-links' onClick={closedMobileMenu}>
                Food List
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--outline'>SIGN UP</Button>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;

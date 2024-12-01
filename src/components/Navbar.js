import {useState} from 'react';
// import './Navbar.css';
import '../styles.css'

export default function Navbar(props) {

 return (
  <>
    {/* <h5 className='nameLabel'>Usuario: <b>{props.userData.Nombre}</b></h5>
    <h5 className='closeSession' onClick={()=>{props.setUserData(false)}} onMouseEnter={(e)=>{e.target.style.cursor='pointer'}}>Cerrar sesión</h5> */}

    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark" style={{'backgroundColor':'#343a40','padding':'0 0 0 1%'}}>
            
            <a className="navbar-brand ps-3" href="index.html">MAESTRO DE MATERIALES</a>
            
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button>
            
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">

            </form>
            
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="#!">Settings</a></li>
                        <li><a className="dropdown-item" href="#!">Activity Log</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#!">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </nav>    
  </>  
 )}
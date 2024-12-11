import {useState} from 'react';
// import './Navbar.css';
import '../styles.css'
import Login from './Login';

export default function Navbar(props) {
 
 const [userCreation,setUserCreation] = useState(false)
 {/* <h5 className='nameLabel'>Usuario: <b>{props.userData.Nombre}</b></h5>
 <h5 className='closeSession' onClick={()=>{props.setUserData(false)}} onMouseEnter={(e)=>{e.target.style.cursor='pointer'}}>Cerrar sesión</h5> */}
 return (
   <>
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark" style={{'backgroundColor':'#343a40','padding':'0 0.5% 0.5% 0.8%'}}>
            
            <a className="navbar-brand ps-3" style={{'margin':'0.7% 0 0 0'}}>MAESTRO DE MATERIALES</a>
            
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown" style={{'overflowX':'hidden'}}>
                        {props.userData.PermisoNivel > 1 && <li><a className="dropdown-item" href="#!" onClick={()=>{setUserCreation(true)}}>Agregar usuario</a></li>}
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#!" onClick={()=>{props.setUserData(false)}}>Cerrar sesión</a></li>
                    </ul>
                </li>
            </ul>         
    </nav>    
    {userCreation && <div className='userCreationMaintCont'><Login setUserCreation={setUserCreation} mode={'userCreation'}/></div>}
   </> 
 )}
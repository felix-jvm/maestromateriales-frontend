import {useState,useRef,useEffect} from 'react';
import './DataCont.css';
import Navbar from './Navbar';
import RecordsTable from './RecordsTable';
import ProductoForm from './ProductoForm';
import SideMenu from './SideMenu';

export default function DataCont(props) {
 const [productoForm,setProductoForm] = useState(false);
 const [sectionFormRoute,setSectionFormRoute] = useState('/producto');

 return (
  <div className='dataContMainCont'>
    <Navbar userData={props.userData} setUserData={props.setUserData}/>
    <SideMenu userData={props.userData} setSectionFormRoute={setSectionFormRoute}/>
    {sectionFormRoute && <RecordsTable setProductoForm={setProductoForm} setUserCreation={props.setUserCreation} userData={props.userData} sectionFormRoute={sectionFormRoute}/>}
    {productoForm && <ProductoForm setProductoForm={setProductoForm} productoForm={productoForm}/>}
  </div>  
 ) }
import {useState,useRef,useEffect} from 'react';
import './RecordsTable.css';
import DT from 'datatables.net-dt';
import DataTable from 'datatables.net-dt';
import ProveedorForm from './forms/ProveedorForm';
import EstadoMaterialForm from './forms/EstadoMaterialForm';
import UnidadMedidaForm from './forms/UnidadMedidaForm';
import CategoriaForm from './forms/CategoriaForm';

DataTable.use(DT);
export default function RecordsTable(props) {

 var lastSelectedRecord = useRef(false)
 const [editForm,setEditForm] = useState(false)

 setTimeout((()=>{
  let divTable = document.getElementsByClassName('divTable')[0]
  let table = document.createElement('table')
  divTable.innerHTML = ''
  table.className = 'display'
  table.id = 'table'
  table.style.width = '100%'
  divTable.appendChild(table)

  fetch(`http://${window.location.hostname}:8001${props.sectionFormRoute}/`)
  .then(re=>re.json())
  .then(re=>{
    var table = new DataTable('#table', {
      columns: [...re['columns']], 
      data:re['records'],
      responsive: true,
      select: 'single',
    })
    table.on('click', 'tr', function () {
     let rowData = table.row(this).data()
     
     if(rowData[0]!==lastSelectedRecord.current){lastSelectedRecord.current=rowData[0]}
     else if(rowData[0]==lastSelectedRecord.current){handleSearchRecord(rowData[0]);lastSelectedRecord.current=undefined}

}) }) }),50)
 
 function handleEditFormToDisplay(route) {if(route == '/producto') {props.setProductoForm(true)}else{setEditForm(true)}} 

 function handleSearchRecord() {props.setProductoForm(`updt_${lastSelectedRecord.current}`)}
    
 return (
  <div className='RecordsTableMainCont'>
   <button className = 'recordButton' onClick = {()=>{handleEditFormToDisplay(props.sectionFormRoute)}}>Agregar</button>
   <button className = 'recordButton' onClick = {()=>{}}>Modificar</button>
   <button className = 'recordButton' onClick = {()=>{}}>Eliminar</button> 
   {props.userData.PermisoNivel == 2 && <button className = 'recordButton' onClick = {()=>{props.setUserCreation(true)}} style={{'float':'right','display':'inline-block'}}>Crear nuevo usuario</button>}   
   <div className='divTable'><table id="table" className="display" width="100%"></table></div>
   {editForm && props.sectionFormRoute == '/proveedor' && <ProveedorForm setEditForm={setEditForm}/>}
   {editForm && props.sectionFormRoute == '/categoria' && <CategoriaForm setEditForm={setEditForm}/>}
   {editForm && props.sectionFormRoute == '/unidadmedida' && <UnidadMedidaForm setEditForm={setEditForm}/>}
   {editForm && props.sectionFormRoute == '/estadomaterial' && <EstadoMaterialForm setEditForm={setEditForm}/>}
  </div>  
 )}
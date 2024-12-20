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
 var targetValue = useRef(false)
 var selectedRoute = useRef(false)

 useEffect(()=>{
  if(props.sectionFormRoute == '/producto') {  
   let familiaRecordsTable = document.getElementsByClassName('FamiliaRecordsTable')[0]
   let segmentoRecordsTable = document.getElementsByClassName('SegmentoRecordsTable')[0]
   let claseRecordsTable = document.getElementsByClassName('ClaseRecordsTable')[0]  

   reqSeqData('familia',familiaRecordsTable)
   reqSeqData('segmento',segmentoRecordsTable)
   reqSeqData('clase',claseRecordsTable)
 }})

 function reqSeqData(route,element) {
  fetch(`http://${window.location.hostname}:8001/${route}/`)
  .then(e=>e.json())
  .then(e=>{
    for(let row of e) {
     let option = document.createElement('option')
     option.value = row['ID']
     option.innerText = row['Descripcion']
     element.appendChild(option)
    };element.value = ''  }) }

 function handleSeqSearch(route,e) {
  let familiaRecordsTable = document.getElementsByClassName('FamiliaRecordsTable')[0]
  let segmentoRecordsTable = document.getElementsByClassName('SegmentoRecordsTable')[0]
  let claseRecordsTable = document.getElementsByClassName('ClaseRecordsTable')[0] 
  if (e.target.value) {
    targetValue.current = e.target.value
    fetch(`http://${window.location.hostname}:8001/${route}/`,{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({'mode':'reqCodeAllSeqData',payload:targetValue.current})
    })
    .then(re=>re.json()) 
    .then(re=>{
      familiaRecordsTable.value = ''
      segmentoRecordsTable.value = ''
      claseRecordsTable.value = ''
      e.target.value = targetValue.current
      targetValue.current = false

      let divTable = document.getElementsByClassName('divTable')[0]
      let tableHtml = document.createElement('table')
      divTable.innerHTML = ''
      tableHtml.id = 'table'
      divTable.appendChild(tableHtml)

      var table = new DataTable('#table', {
        columns: [...re['columns']], 
        data:re['records'],
        responsive: 'true',
        select: 'single',
      })
      table.on('dblclick', 'tr', function () {
       let rowData = table.row(this).data()
       if(rowData){
        lastSelectedRecord.current=rowData[0]
        handleSearchRecord(rowData[0])
       }}) 
      table.on('click', 'tr', function () {
       let rowData = table.row(this).data()
       if(rowData){
        lastSelectedRecord.current=rowData[0]
    }}) }) } }

 function refreshDataTable () {
  setTimeout((()=>{
    let divTable = document.getElementsByClassName('divTable')[0]
    let table = document.createElement('table')
    divTable.innerHTML = ''
    table.id = 'table'
    divTable.appendChild(table)
  
    fetch(`http://${window.location.hostname}:8001${props.sectionFormRoute}/`)
    .then(re=>re.json())
    .then(re=>{
      var table = new DataTable('#table', {
        columns: [...re['columns']], 
        data:re['records'],
        responsive: 'true',
        select: 'single',
      })
      table.on('dblclick', 'tr', function () {
       let rowData = table.row(this).data()
       if(rowData){
        lastSelectedRecord.current=rowData[0]
        handleSearchRecord(rowData[0])
       }}) 
      table.on('click', 'tr', function () {
       let rowData = table.row(this).data()
       if(rowData){
        lastSelectedRecord.current=rowData[0]
    }})  
}) }),50) }
 
 function handleEditFormToDisplay(route) {if(route == '/producto') {props.setProductoForm(true)}else{setEditForm(true)}} 

 function handleSearchRecord(recordCode) {if(props.sectionFormRoute == '/producto') {props.setProductoForm(`updt_${recordCode}`)}else{setEditForm(`updt_${lastSelectedRecord.current}`)}}
 
 function handleRemoveRecord(route,identifier) {
  fetch(`http://${window.location.hostname}:8001${route}/`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({'mode':'delete','code':identifier})
  })
  .then(re=>re.json())
  .then(re=>{if(re['msg'] == 'ok') {refreshDataTable()}}) }

  refreshDataTable()

 return (
  <div className='RecordsTableMainCont'>
   <h1 style={{'margin':'50px 0 0 0'}}>{(props.sectionFormRoute == '/producto' && 'Productos') || (props.sectionFormRoute == '/categoria' && 'Categorias') ||
    (props.sectionFormRoute == '/unidadmedida' && 'Unidades de medida') || (props.sectionFormRoute == '/estadomaterial' && 'Estados del material') || 
    (props.sectionFormRoute == '/proveedor' && 'Proveedores')}</h1>
   <button className = 'recordButton' onClick = {()=>{handleEditFormToDisplay(props.sectionFormRoute)}}>Agregar</button>
   <button className = 'recordButton' onClick = {()=>{handleRemoveRecord(props.sectionFormRoute,lastSelectedRecord.current)}}>Eliminar</button> 
      <br/>
      {props.sectionFormRoute == '/producto' && <div className='codeSeqDivRecordsTable' style={{'marginLeft':'0'}}>
       <h5 className='sameLineLabel'>Familia:</h5> 
       <br/>
       <select name='FamiliaRecordsTable' className='FamiliaRecordsTable sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'100%','maxWidth':'100%'}} onClick={(e)=>{handleSeqSearch('familia',e)}} required={true}></select>      
      </div>}
      {props.sectionFormRoute == '/producto' && <div className='codeSeqDivRecordsTable'>
       <h5 className='sameLineLabel'>Segmento:</h5> 
       <br/>
       <select name='SegmentoRecordsTable' className='SegmentoRecordsTable sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'100%','maxWidth':'100%'}} onClick={(e)=>{handleSeqSearch('segmento',e)}} required={true}></select>      
      </div>}
      {props.sectionFormRoute == '/producto' && <div className='codeSeqDivRecordsTable'>
       <h5 className='sameLineLabel'>Clase:</h5>
       <br/>
       <select name='ClaseRecordsTable' className='ClaseRecordsTable sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'100%','maxWidth':'100%'}} onClick={(e)=>{handleSeqSearch('clase',e)}} required={true}></select>      
     </div>}
   <div className="divTable">    
     <table id="table"></table>     
   </div>
   {editForm && props.sectionFormRoute == '/proveedor' && <ProveedorForm setEditForm={setEditForm} editForm={editForm}/>}
   {editForm && props.sectionFormRoute == '/categoria' && <CategoriaForm setEditForm={setEditForm} editForm={editForm}/>}
   {editForm && props.sectionFormRoute == '/unidadmedida' && <UnidadMedidaForm setEditForm={setEditForm} editForm={editForm}/>}
   {editForm && props.sectionFormRoute == '/estadomaterial' && <EstadoMaterialForm setEditForm={setEditForm} editForm={editForm}/>}
  </div>  
 )}
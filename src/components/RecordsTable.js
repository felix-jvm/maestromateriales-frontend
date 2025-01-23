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

 useEffect(()=>{
  if(props.sectionFormRoute == '/producto') {  
   let familiaRecordsTableSelect = document.getElementsByClassName('FamiliaRecordsTableSelect')[0]
   let segmentoRecordsTableSelect = document.getElementsByClassName('SegmentoRecordsTableSelect')[0]
   let claseRecordsTableSelect = document.getElementsByClassName('ClaseRecordsTableSelect')[0]  

   reqSeqData('segmento',segmentoRecordsTableSelect)
   reqSeqData('familia',familiaRecordsTableSelect)
   reqSeqData('clase',claseRecordsTableSelect)
 }})

 function reqSeqData(route,element) {
  fetch(`http://${window.location.hostname}:8001/${route}/`)
  .then(e=>e.json())
  .then(e=>{
    element.innerHTML = ''
    for(let row of e) {
     let option = document.createElement('option')
     option.value = row['ID']
     option.innerText = row['Descripcion']
     element.appendChild(option)
    };element.value = ''  }) }

 function handleSeqSearch(route,e) {
  let familiaRecordsTableSelect = document.getElementsByClassName('FamiliaRecordsTableSelect')[0]
  let claseRecordsTableSelect = document.getElementsByClassName('ClaseRecordsTableSelect')[0] 
  if (e.target.value) {
    targetValue.current = e.target.value
    fetch(`http://${window.location.hostname}:8001/${route}/`,{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({'mode':'reqCodeAllSeqData',payload:targetValue.current})
    })
    .then(re=>re.json()) 
    .then(re=>{
      refreshDataTableDinamically(re)
      if(e.target.name == 'SegmentoRecordsTableSelect' && e.target.value) {fillSeqSelects('familia',e.target.value,familiaRecordsTableSelect)}  
      if(e.target.name == 'FamiliaRecordsTableSelect' && e.target.value) {fillSeqSelects('clase',e.target.value,claseRecordsTableSelect)}    
  }) } }

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
 
 function refreshDataTableDinamically (data) {
  let divTable = document.getElementsByClassName('divTable')[0]
  let tableHtml = document.createElement('table')
  divTable.innerHTML = ''
  tableHtml.id = 'table'
  divTable.appendChild(tableHtml)

  var table = new DataTable('#table', {
    columns: [...data['columns']], 
    data:data['records'],
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
   } }) }

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

  function fillSeqSelects(route,toFilter,element) {
    let value = toFilter
    fetch(`http://${window.location.hostname}:8001/${route}/`,{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({mode:'listFilteredRecords',payload:value})
    })
    .then(e=>e.json())
    .then(e=>{
      if(e.length) {
       element.innerHTML = ''
       for(let optionRecord of e) {
        let option = document.createElement('option')
        option.value = optionRecord['ID']
        option.innerText = optionRecord['Descripcion']
        element.appendChild(option)
      }element.value = ''}
    })}  

  function resetTableAndOptions(e) {
    e.preventDefault()
    let segmentoRecordsTableSelect = document.getElementsByClassName('SegmentoRecordsTableSelect')[0]
    let familiaRecordsTableSelect = document.getElementsByClassName('FamiliaRecordsTableSelect')[0]
    let claseRecordsTableSelect = document.getElementsByClassName('ClaseRecordsTableSelect')[0]      
    reqSeqData('segmento',segmentoRecordsTableSelect)
    reqSeqData('familia',familiaRecordsTableSelect)
    reqSeqData('clase',claseRecordsTableSelect)
    refreshDataTable()
  } 

  function generateProductRecords() {
    fetch(`http://${window.location.hostname}:8001/producto/`,{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     'body':JSON.stringify({mode:'generateProductRecords'})})
     .then(response => {
      if (response.ok) {
          // Crear un enlace temporal para descargar el archivo
          response.blob().then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'lista_productos.xlsx';
              document.body.appendChild(a);
              a.click();
              a.remove();
          });
      } else {alert("Hubo un problema al descargar el archivo.")}
     });     
    //  .then(re=>re.json())
    //  .then(re=>{if(re['msg'] == 'ok') {alert('Archivo generado correctamente')}})     
    }

  refreshDataTable()

 return (
  <div className='RecordsTableMainCont'>
   <h1 style={{'margin':'50px 0 0 0'}}>{(props.sectionFormRoute == '/producto' && 'Productos') || (props.sectionFormRoute == '/categoria' && 'Categorias') ||
    (props.sectionFormRoute == '/unidadmedida' && 'Unidades de medida') || (props.sectionFormRoute == '/estadomaterial' && 'Estados del material') || 
    (props.sectionFormRoute == '/proveedor' && 'Proveedores')}</h1>
   <button className = 'recordButton' onClick = {()=>{handleEditFormToDisplay(props.sectionFormRoute)}}>Agregar</button>
   <button className = 'recordButton' onClick = {()=>{handleRemoveRecord(props.sectionFormRoute,lastSelectedRecord.current)}}>Eliminar</button> 
   {props.sectionFormRoute == '/producto' && <button className='recordButton' onClick={()=>{generateProductRecords()}}>Generar lista de productos</button>}
      <br/>
      {props.sectionFormRoute == '/producto' && <h3 style={{'margin':'30px 0 0 0'}}>Filtrar productos en base a:</h3>}
      {props.sectionFormRoute == '/producto' && <div className='codeSeqDivRecordsTable'>
       <h5 className='sameLineLabel'>Segmento:</h5> 
       <br/>
       <select name='SegmentoRecordsTableSelect' className='SegmentoRecordsTableSelect sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'100%','maxWidth':'100%'}} onClick={(e)=>{handleSeqSearch('segmento',e)}} required={true}></select>      
      </div>}
      {props.sectionFormRoute == '/producto' && <div className='codeSeqDivRecordsTable' style={{'marginLeft':'0'}}>
       <h5 className='sameLineLabel'>Familia:</h5> 
       <br/>
       <select name='FamiliaRecordsTableSelect' className='FamiliaRecordsTableSelect sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'100%','maxWidth':'100%'}} onClick={(e)=>{handleSeqSearch('familia',e)}} required={true}></select>      
      </div>}      
      {props.sectionFormRoute == '/producto' && <div className='codeSeqDivRecordsTable'>
       <h5 className='sameLineLabel'>Clase:</h5>
       <br/>
       <select name='ClaseRecordsTableSelect' className='ClaseRecordsTableSelect sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'100%','maxWidth':'100%'}} onClick={(e)=>{handleSeqSearch('clase',e)}} required={true}></select>      
     </div>}
     {props.sectionFormRoute == '/producto' && <div className='codeSeqDivRecordsTable'>
       <a className='sameLineLabel' href='' style={{'textDecoration':'none','margin':'0 0 0 10px'}} onClick={(e)=>{resetTableAndOptions(e)}}>Eliminar filtros</a>
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
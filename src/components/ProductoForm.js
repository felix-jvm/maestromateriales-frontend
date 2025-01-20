import {useState,useEffect,useRef} from 'react';
import Modal from './Modal';
import InlineCategoriaForm from './inlineForms/InlineCategoriaForm';
import InlineEstadoMaterialForm from './inlineForms/InlineEstadoMaterialForm';
import InlineProveedorForm from './inlineForms/InlineProveedorForm';
import InlineUnidadMedidaForm from './inlineForms/InlineUnidadMedidaForm';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './ProductoForm.css';

export default function ProductoForm(props) {
 const [updt,setUpdt] = useState(false)
 const [image, setImage] = useState(false)
 const [archive, setArchive] = useState(false)
 const [duplCodeError,setDuplCodeError] = useState(false)
 const [inlineForm,setInlineForm] = useState(false)
 var codeInitValue = useRef(false)
 var payload = useRef({})
 var codeError = useRef(false)
 typeof(props.productoForm) == 'string' && props.productoForm.includes('updt')? payload.current['updt_producto_codigo'] = props.productoForm.split('_')[1].replace(' ','').trim():void 0

 useEffect(()=>{
  var re = false
  setTimeout(()=>{
    fetch(`http://${window.location.hostname}:8001/segmento/`)
    .then(e=>e.json())
    .then(e=>{
      let familiaSelect = document.getElementsByClassName('Segmento')[0]
      for(let optionRecord of e) {
       let option = document.createElement('option')
       option.value = optionRecord['ID']
       option.innerText = optionRecord['Descripcion']
       familiaSelect.appendChild(option)
      }familiaSelect.value = ''})

    fetch(`http://${window.location.hostname}:8001/producto/`,{
     'method':'POST',
     'headers':{'Content-Type':'application/json'},
     body:JSON.stringify({'mode':'fillForm','productCode':props.productoForm})
    })
    .then(e=>e.json())
    .then(e=>{
     re = e 
     console.log('------------------------------->',re)
     for(let selectName of Object.keys(e)) {
      if (selectName == 'specificRecord') {continue}
      let selectElement = document.getElementsByClassName(`${selectName}`)[0]
      for(let options of e[selectName]) {
        let option = document.createElement('option')    
        option.value = options['ID']
        option.innerText = options['Descripcion']
        selectElement.appendChild(option)
        selectElement.value = ''
    } } }) },200)
    
  setTimeout(()=>{
      if(re.specificRecord && re.specificRecord.length) {
        setUpdt(true) 
        for(let elementName of Object.keys(re.specificRecord[0])){
         let element = document.getElementsByClassName(`${elementName}`)[0]
         if (elementName == 'Descripcion') {element.focus();codeInitValue.current = re.specificRecord[0][elementName]}
         if(element){element.value = re.specificRecord[0][elementName]} }
       
        if(re.specificRecord[0].FichaTecnica == 'True') {
         fetch(`http://${window.location.hostname}:8001/producto/`,{
           'method':'POST',
           'headers':{'Content-Type':'application/json'},
           body:JSON.stringify({'mode':'request_ficha_tecnica','productCode':props.productoForm})
         })    
         .then((res)=>res.blob())
         .then((res)=>{setImage(URL.createObjectURL(res))}) } } }, 300) },[])
   
 function handleSend(e) {
  e.preventDefault()  
  let productoForm = document.getElementsByClassName('productoForm')[0]
  payload.current['Codigo'] = productoForm.Codigo.value
  if(Object.keys(payload.current).includes('updt_producto_codigo') && productoForm.Codigo.value != codeInitValue.current) {payload.current = {...payload.current,'codeChanged':true}}
  payload = payload.current
  fetch(`http://${window.location.hostname}:8001/producto/`,{
    'method':'POST',
    'headers':{'Content-Type':'application/json'},
    body:JSON.stringify({'mode':'create',payload})
  })
  .then(re=>re.json())
  // .then(re=>{if(re['msg'].length > 5){setDuplCodeError(re['msg']);codeError.current=true}})
  setTimeout(()=>{
   if (archive && !duplCodeError) {
    let productCode = productoForm['Codigo'].value
    const formData = new FormData()
    formData.append('mode','save_ficha_tecnica')
    formData.append('productCode',productCode)
    formData.append('file',archive)  
    fetch(`http://${window.location.hostname}:8001/producto/`,{
       method:'POST',
       body:formData
    })}
    props.setProductoForm(false)
    // if(codeError.current){codeError.current=false}else{props.setProductoForm(false)}
  },400)}


 const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl)
    setArchive(file)
    }}    
 const handleImageClick = () => {if (image) {window.open(image, '_blank')}}

 function handleUpdtProp(e,nameRoute) {
  let name = nameRoute == 'parentElement'? e.target.parentElement.name:e.target.name
  if (e.target.value.length){payload.current[name] = e.target.value}else{delete payload.current[name]}
 }

 function handleDisplayInlineForm(e,route,element) {e.preventDefault();setInlineForm(`${route},${element}`)}

 function fillSeqSelects(route,toFilter,element,completedSeq=false) {
  let value = toFilter
  let mode = !completedSeq? 'listFilteredRecords':'reqSeqCode'
  fetch(`http://${window.location.hostname}:8001/${route}/`,{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({mode,payload:value})
  })
  .then(e=>e.json())
  .then(e=>{
   if(!completedSeq) {   
    element.innerHTML = ''
    if(e.length) {
     for(let optionRecord of e) {
      let option = document.createElement('option')
      option.value = optionRecord['ID']
      option.innerText = optionRecord['Descripcion']
      element.appendChild(option)
    }};element.value = ''
   } else {
    let Codigo = document.getElementsByClassName('Codigo')[0]
    if(e['seq']) {Codigo.value = e['seq']}
   } })}

 function handleSequenceInt(e) {
    let codigo = document.getElementsByClassName('Codigo')[0]
    let segmentoSelect = document.getElementsByClassName('Segmento')[0]
    let familiaSelect = document.getElementsByClassName('Familia')[0]
    let claseSelect = document.getElementsByClassName('Clase')[0]
    if(e.target.name == 'Segmento' && e.target.value) {fillSeqSelects('familia',e.target.value,familiaSelect);claseSelect.innerText = ''}
    if(e.target.name == 'Familia' && !segmentoSelect.value) {alert('Primero debe seleccionar un segmento')}
     else if (e.target.name == 'Familia' && segmentoSelect.value) {fillSeqSelects('clase',e.target.value,claseSelect)}
    if(e.target.name == 'Clase' && !familiaSelect.value) {alert('Primero debe seleccionar una familia')}
     else if (e.target.name == 'Clase' && segmentoSelect.value) {fillSeqSelects('producto',claseSelect.value,claseSelect,true)}
 } 

 return (
 <div className='productoFormOuterCont'>
  <div className='productoFormInnerCont'>
   <form className='productoForm'>
    <br/>
    <br/>
   <button className='actionsButton' onClick={e=>{props.setProductoForm(false)}}>Cerrar</button>       
   <button className='actionsButton' onClick={e=>{handleSend(e)}}>Guardar datos</button>
    <h1 className='productoFormTitle'>Crear o modificar Producto</h1>
    <br/>
      <div className='codeSeqDiv'>
       <a className='sameLineLabel' data-tooltip-id='SegmentoProductLabel' data-tooltip-content='Segmento'>SEGMENTO:</a> 
       <Tooltip id='SegmentoProductLabel'/>
       <br/>
       <select name='Segmento' className='Segmento sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'100%','maxWidth':'100%'}} onClick={(e)=>{handleSequenceInt(e)}} required={true}></select>      
      </div>    
      <div className='codeSeqDiv' style={{'marginLeft':'0'}}>
       <a className='sameLineLabel' data-tooltip-id='FamiliaProductLabel' data-tooltip-content='Familia'>FAMILIA:</a>
       <Tooltip id='FamiliaProductLabel'/> 
       <br/>
       <select name='Familia' className='Familia sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'100%','maxWidth':'100%'}} onClick={(e)=>{handleSequenceInt(e)}} required={true}></select>      
      </div> 
      <div className='codeSeqDiv' >
       <a className='sameLineLabel' data-tooltip-id='ClaseProductLabel' data-tooltip-content='Clase'>CLASE:</a>
       <Tooltip id='ClaseProductLabel'/>
       <br/>
       <select name='Clase' className='Clase sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'100%','maxWidth':'100%'}} onClick={(e)=>{handleSequenceInt(e)}} required={true}></select>      
      </div> 
    <br/>    
    <a className='sameLineLabel' data-tooltip-id='CódigoProductLabel' data-tooltip-content='CÓDIGO UNSPSC'>CÓDIGO:</a>
    <Tooltip id='CódigoProductLabel'/>
    <br/>
      <input type='text' name='Codigo' className='sameLineInput Codigo' readOnly={true} required={true}/>
    <br/>
    <a className='sameLineLabel' data-tooltip-id='DescripciónProductLabel' data-tooltip-content='DESCRIPCIÓN UNSPSC'>DESCRIPCIÓN:</a>
    <Tooltip id='DescripciónProductLabel'/>
    <br/>
      <input name='Descripcion' className='sameLineInput Descripcion' onBlur={e=>{handleUpdtProp(e,'element')}} style={{'minWidth':'80%'}}/>  
    <br/>
    <a className='sameLineLabel' data-tooltip-id='estadoMaterialProductLabel' data-tooltip-content='ACTIVO, OBSOLETO, DESCONTINUADO'>ESTADO MATERIAL:</a>
    <Tooltip id='estadoMaterialProductLabel'/>    
    <a className='inlineFormLabel' href='' onClick={(e)=>{handleDisplayInlineForm(e,'estadomaterial','EstadoMaterial')}}>AGREGAR ESTADO MATERIAL</a>
    <br/>
      <select name='EstadoMaterial' className='EstadoMaterial sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'40%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>
    <a className='sameLineLabel' data-tooltip-id='CategoriaProductLabel' data-tooltip-content='CATEGORIA'>CATEGORIA:</a>
    <Tooltip id='CategoriaProductLabel'/>
    <a className='inlineFormLabel' href='' onClick={(e)=>{handleDisplayInlineForm(e,'categoria','Categoria')}}>AGREGAR CATEGORIA</a>
    <br/>    
      <select name='Categoria' className='sameLineInput Categoria'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'40%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>
    <a className='sameLineLabel' data-tooltip-id='UnidadMedidaProductLabel' data-tooltip-content='UNIDAD DE MEDIDA'>U/M:</a>
    <Tooltip id='UnidadMedidaProductLabel'/>
    <a className='inlineFormLabel' href='' onClick={(e)=>{handleDisplayInlineForm(e,'unidadmedida','UnidadMedida')}}>AGREGAR UNIDAD DE MEDIDA</a>
    <br/>    
      <select name='UnidadMedida' className='sameLineInput UnidadMedida' style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'40%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>  
    <a className='sameLineLabel' data-tooltip-id='MinimoProductLabel' data-tooltip-content='SEGURIDAD ANTE EVENTOS'>MINIMO:</a>
    <Tooltip id='MinimoProductLabel'/>
    <br/>    
      <input type='number' name='Minimo' className='sameLineInput Minimo'  onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/> 
    <a className='sameLineLabel' data-tooltip-id='MaximoProductLabel' data-tooltip-content='NIVEL MAXIMO PARA EVITAR OBSOLECENCIA'>MAXIMO:</a>
    <Tooltip id='MaximoProductLabel'/>    
    <br/>    
      <input type='number' name='Maximo' className='sameLineInput Maximo' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <a className='sameLineLabel' data-tooltip-id='puntoReordenProductLabel' data-tooltip-content='NIVEL DEL INVENTARIO PARA PEDIDO'>PUNTO REORDEN:</a>
    <Tooltip id='puntoReordenProductLabel'/>
    <br/>    
      <input type='number' name='PuntoReorden' className='sameLineInput PuntoReorden' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <a className='sameLineLabel' data-tooltip-id='proveedorProductLabel' data-tooltip-content='PROVEEDOR'>PROVEEDOR:</a>
    <Tooltip id='proveedorProductLabel'/>
    <a className='inlineFormLabel' href='' onClick={(e)=>{handleDisplayInlineForm(e,'proveedor','Proveedor')}}>AGREGAR PROVEEDOR</a>
    <br/>    
      <select name='Proveedor' className='sameLineInput Proveedor' style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'40%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>  
    <a className='sameLineLabel' data-tooltip-id='tiempoEntregaProductLabel' data-tooltip-content='DIAS'>TIEMPO DE ENTREGA:</a>
    <Tooltip id='tiempoEntregaProductLabel'/>
    <br/>
      <input type='number' name='TiempoEntrega' className='sameLineInput TiempoEntrega' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <a className='sameLineLabel' data-tooltip-id='pedidoEstandarProductLabel' data-tooltip-content='CANTIDAD ACOSTUMBRADA DEL PEDIDO'>PEDIDO ESTANDAR:</a>
    <Tooltip id='pedidoEstandarProductLabel'/>
    <br/>    
      <input type='number' name='PedidoEstandar' className='sameLineInput PedidoEstandar' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <a className='sameLineLabel' data-tooltip-id='loteMinimoProductLabel' data-tooltip-content='BASADO EN COSTO BENEFICIO'>LOTE MINIMO:</a>
    <Tooltip id='loteMinimoProductLabel'/>
    <br/>    
      <input type='number' name='LoteMinimo' className='sameLineInput LoteMinimo' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <a className='sameLineLabel' data-tooltip-id='loteMaximoProductLabel' data-tooltip-content='CAPACIDAD DE ALMACENAMIENTO GENERAL'>LOTE MAXIMO:</a>
    <Tooltip id='loteMaximoProductLabel'/>
    <br/>    
      <input type='number' name='LoteMaximo' className='sameLineInput LoteMaximo' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <a className='sameLineLabel' data-tooltip-id='tiempoProcesoInternoProductLabel' data-tooltip-content='DESDE EL PEDIDO HASTA LA RECEPCIÓN'>TIEMPO PROCESO INTERNO:</a>
    <Tooltip id='tiempoProcesoInternoProductLabel'/>
    <br/>    
      <input type='number' name='TiempoProcesoInterno' className='sameLineInput TiempoProcesoInterno' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <a className='sameLineLabel' data-tooltip-id='tiempoVidaUtilProductLabel' data-tooltip-content='CICLO DE VIDA/DIAS'>TIEMPO VIDA UTIL:</a>
    <Tooltip id='tiempoVidaUtilProductLabel'/>
    <br/>    
      <input type='number' name='TiempoVidaUtil' className='sameLineInput TiempoVidaUtil' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>        
    <a className='sameLineLabel' data-tooltip-id='fichaTecnicaProductLabel' data-tooltip-content='ALMACENAMIENTO, STOCKING, ETC.' style={{'display':'block','margin': '10px 0 10px 0','position':'relative'}}>FICHA TECNICA:</a> 
    <Tooltip id='fichaTecnicaProductLabel'/>
      <input type="file" accept="image/*" onChange={handleImageUpload} className='sameLineInput'/> 
      {image && (
        <img
          src={image}
          alt="Uploaded"
          style={{'display':'block','cursor':'pointer','margin': '1px 0 0 0','maxWidth':'100px','maxHeight':'100px' }}
          className='imageElement'
          onClick={handleImageClick}
        />
      )}   
      <br/>      
   </form>
  </div>  
  {inlineForm && ( (inlineForm.split(',')[0]=='categoria' && <InlineCategoriaForm inlineForm={inlineForm} setInlineForm={setInlineForm} payload={payload}/>) || 
  (inlineForm.split(',')[0]=='estadomaterial' && <InlineEstadoMaterialForm inlineForm={inlineForm} setInlineForm={setInlineForm} payload={payload}/>) || 
  (inlineForm.split(',')[0]=='unidadmedida' && <InlineUnidadMedidaForm inlineForm={inlineForm} setInlineForm={setInlineForm} payload={payload}/>) || 
  (inlineForm.split(',')[0]=='proveedor' && <InlineProveedorForm inlineForm={inlineForm} setInlineForm={setInlineForm} payload={payload}/>) )}

  {duplCodeError && <Modal displayInnerCont={true} reload={false} message={duplCodeError} setModal={setDuplCodeError} mainContColor={'black'} InnerContColor={'white'} 
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
  </svg>}/>}
 </div> 
 )
}
import {useState,useEffect,useRef} from 'react';
import Modal from './Modal';
import './ProductoForm.css';

export default function ProductoForm(props) {
 const [updt,setUpdt] = useState(false)
 const [image, setImage] = useState(false)
 const [archive, setArchive] = useState(false)
 const [duplCodeError,setDuplCodeError] = useState(false)
 var codeInitValue = useRef(false)
 var payload = useRef({})
 var codeError = useRef(false)
 typeof(props.productoForm) == 'string' && props.productoForm.includes('updt')? payload.current['updt_producto_codigo'] = props.productoForm.split('_')[1].replace(' ','').trim():void 0

 useEffect(()=>{
  var re = false
  setTimeout(()=>{
    fetch(`http://${window.location.hostname}:8001/producto/`,{
     'method':'POST',
     'headers':{'Content-Type':'application/json'},
     body:JSON.stringify({'mode':'fillForm','productCode':props.productoForm})
    })
    .then(e=>e.json())
    .then(e=>{
     re = e 
     for(let selectName of Object.keys(e)) {
      if (selectName == 'specificRecord') {continue}
      let selectElement = document.getElementsByClassName(`${selectName}`)[0]
      for(let options of e[selectName]) {
        let option = document.createElement('option')    
        option.value = options['ID']
        option.innerText = options['Descripcion']
        selectElement.appendChild(option)
        selectElement.value = ''
    } } }) },100)
    
  setTimeout(()=>{
      if(re.specificRecord && re.specificRecord.length) {
        setUpdt(true) 
        for(let elementName of Object.keys(re.specificRecord[0])){
         let element = document.getElementsByClassName(`${elementName}`)[0]
         if (elementName == 'Codigo') {element.focus();codeInitValue.current = re.specificRecord[0][elementName]}
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
  if(Object.keys(payload.current).includes('updt_producto_codigo') && productoForm.Codigo.value != codeInitValue.current) {payload.current = {...payload.current,'codeChanged':true}}
  payload = payload.current
  fetch(`http://${window.location.hostname}:8001/producto/`,{
    'method':'POST',
    'headers':{'Content-Type':'application/json'},
    body:JSON.stringify({'mode':'create',payload})
  })
  .then(re=>re.json())
  .then(re=>{if(re['msg'].length > 5){setDuplCodeError(re['msg']);codeError.current=true}})
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
    })}if(codeError.current){codeError.current=false}else{props.setProductoForm(false)}},200)
  }


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

 return (
 <div className='productoFormOuterCont'>
  <div className='productoFormInnerCont'>
   <form className='productoForm'>
    <br/>
    <br/>
   <button className='actionsButton' onClick={e=>{props.setProductoForm(false)}}>Cerrar</button>       
   <button className='actionsButton' onClick={e=>{handleSend(e)}}>Guardar datos</button>
    <h1 className='productoFormTitle'>Crear o modificar Producto</h1>
      
    <h5 className='sameLineLabel'>Código:</h5>
    <br/>
      <input type='text' name='Codigo' className='sameLineInput Codigo' required={true} onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <h5 className='sameLineLabel'>Descripción:</h5>
    <br/>
      <input name='Descripcion' className='sameLineInput Descripcion' onBlur={e=>{handleUpdtProp(e,'element')}} style={{'minWidth':'80%'}}/>  
    <br/>
    <h5 className='sameLineLabel'>Estado Material:</h5>
    <br/>
      <select name='EstadoMaterial' className='EstadoMaterial sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'40%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>
    <h5 className='sameLineLabel'>Categoria:</h5>
    <br/>    
      <select name='Categoria' className='sameLineInput Categoria'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'40%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>
    <h5 className='sameLineLabel'>Unidad Medida:</h5>
    <br/>    
      <select name='UnidadMedida' className='sameLineInput UnidadMedida' style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'40%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>  
    <h5 className='sameLineLabel'>Minimo:</h5>
    <br/>    
      <input type='number' name='Minimo' className='sameLineInput Minimo'  onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/> 
    <h5 className='sameLineLabel'>Maximo:</h5>
    <br/>    
      <input type='number' name='Maximo' className='sameLineInput Maximo' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <h5 className='sameLineLabel'>Punto Reorden:</h5>
    <br/>    
      <input type='number' name='PuntoReorden' className='sameLineInput PuntoReorden' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <h5 className='sameLineLabel'>Proveedor:</h5>
    <br/>    
      <select name='Proveedor' className='sameLineInput Proveedor' style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'40%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>  
    <h5 className='sameLineLabel'>Tiempo Entrega:</h5>
    <br/>    
      <input type='number' name='TiempoEntrega' className='sameLineInput TiempoEntrega' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <h5 className='sameLineLabel'>Pedido Estandar:</h5>
    <br/>    
      <input type='number' name='PedidoEstandar' className='sameLineInput PedidoEstandar' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <h5 className='sameLineLabel'>Lote Minimo:</h5>
    <br/>    
      <input type='number' name='LoteMinimo' className='sameLineInput LoteMinimo' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <h5 className='sameLineLabel'>Lote Maximo:</h5>
    <br/>    
      <input type='number' name='LoteMaximo' className='sameLineInput LoteMaximo' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <h5 className='sameLineLabel'>Tiempo Proceso Interno:</h5>
    <br/>    
      <input type='number' name='TiempoProcesoInterno' className='sameLineInput TiempoProcesoInterno' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <h5 className='sameLineLabel'>Tiempo Vida Util:</h5>
    <br/>    
      <input type='number' name='TiempoVidaUtil' className='sameLineInput TiempoVidaUtil' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>        
    <h5 className='sameLineLabel' style={{'display':'block','margin': '0 0 0 0','position':'relative'}}>FichaTecnica:</h5> 
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
   </form>
  </div>  
  {duplCodeError && <Modal displayInnerCont={true} reload={false} message={duplCodeError} setModal={setDuplCodeError} mainContColor={'black'} InnerContColor={'white'} 
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
  </svg>}/>}
 </div> 
 )
}
import {useState,useEffect,useRef} from 'react';
import './ProductoForm.css';

export default function ProductoForm(props) {
 const [updt,setUpdt] = useState(false)
 const [image, setImage] = useState(false);
 const [archive, setArchive] = useState(false);
 var payload = useRef({})
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
         if (elementName == 'Codigo') {element.focus()}
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
  // let payload = !updt? {'Codigo':'','Descripcion':'','EstadoMaterial':'','Categoria':'','UnidadMedida':'','Minimo':'','Maximo':'','PuntoReorden':'','Proveedor':'','TiempoEntrega':'','PedidoEstandar':'','LoteMinimo':'','LoteMaximo':'','TiempoProcesoInterno':'','TiempoVidaUtil':''}:payload.current
  // if(!updt) {for(let inputs of Object.keys(payload)) {payload[inputs] = productoForm[inputs].value?productoForm[inputs].value:undefined}}
  payload = payload.current
  fetch(`http://${window.location.hostname}:8001/producto/`,{
    'method':'POST',
    'headers':{'Content-Type':'application/json'},
    body:JSON.stringify({'mode':'create',payload})
  })
  setTimeout(()=>{
   if (archive) {
    let productCode = productoForm['Codigo'].value
    const formData = new FormData()
    formData.append('mode','save_ficha_tecnica')
    formData.append('productCode',productCode)
    formData.append('file',archive)  
    fetch(`http://${window.location.hostname}:8001/producto/`,{
       method:'POST',
       body:formData
     })
  } props.setProductoForm(false) },200)  }

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
      <input type='text' name='Codigo' className='sameLineInput Codigo' required={true} onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>  
    <br/>
    <h5 className='sameLineLabel'>Descripción:</h5>
      <input name='Descripcion' className='sameLineInput Descripcion' onBlur={e=>{handleUpdtProp(e,'element')}} style={{'minWidth':'80%'}}/>
    <br/>  
    <br/>
    <h5 className='sameLineLabel'>Estado Material:</h5>
      <select name='EstadoMaterial' className='EstadoMaterial sameLineInput'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'35%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>  
    <br/>
    <h5 className='sameLineLabel'>Categoria:</h5>
      <select name='Categoria' className='sameLineInput Categoria'  style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'40%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>
    <br/>
    <h5 className='sameLineLabel'>Unidad Medida:</h5>
      <select name='UnidadMedida' className='sameLineInput UnidadMedida' style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'35%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>
    <br/>  
    <h5 className='sameLineLabel'>Minimo:</h5>
      <input type='number' name='Minimo' className='sameLineInput Minimo'  onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <br/> 
    <h5 className='sameLineLabel'>Maximo:</h5>
      <input type='number' name='Maximo' className='sameLineInput Maximo' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <br/>  
    <h5 className='sameLineLabel'>Punto Reorden:</h5>
      <input type='number' name='PuntoReorden' className='sameLineInput PuntoReorden' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <br/>  
    <h5 className='sameLineLabel'>Proveedor:</h5>
      <select name='Proveedor' className='sameLineInput Proveedor' style={{'padding':'0 0 0 5px','minHeight':'35px','maxHeight':'35px','minWidth':'40%'}} onBlur={e=>{handleUpdtProp(e,'element')}}></select>
    <br/>
    <br/>  
    <h5 className='sameLineLabel'>Tiempo Entrega:</h5>
      <input type='number' name='TiempoEntrega' className='sameLineInput TiempoEntrega' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <br/>  
    <h5 className='sameLineLabel'>Pedido Estandar:</h5>
      <input type='number' name='PedidoEstandar' className='sameLineInput PedidoEstandar' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <br/>  
    <h5 className='sameLineLabel'>Lote Minimo:</h5>
      <input type='number' name='LoteMinimo' className='sameLineInput LoteMinimo' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <br/>  
    <h5 className='sameLineLabel'>Lote Maximo:</h5>
      <input type='number' name='LoteMaximo' className='sameLineInput LoteMaximo' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <br/>  
    <h5 className='sameLineLabel'>Tiempo Proceso Interno:</h5>
      <input type='number' name='TiempoProcesoInterno' className='sameLineInput TiempoProcesoInterno' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <br/>  
    <h5 className='sameLineLabel'>Tiempo Vida Util:</h5>
      <input type='number' name='TiempoVidaUtil' className='sameLineInput TiempoVidaUtil' onBlur={e=>{handleUpdtProp(e,'element')}}/>
    <br/>
    <br/>        
    <h5 className='sameLineLabel'>FichaTecnica:</h5>
      <input type="file" accept="image/*" onChange={handleImageUpload} style={{'padding':'0'}} className='sameLineInput'/> 
      {image && (
        <img
          src={image}
          alt="Uploaded"
          style={{ cursor: 'pointer', margin: '10px 0 0 5px', maxWidth: '100px', maxHeight:'100px' }}
          className='imageElement'
          onClick={handleImageClick}
        />
      )}         
   </form>
  </div>  
 </div> 
 )
}
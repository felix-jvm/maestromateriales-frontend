import {useState,useRef,useEffect} from 'react';
import './formStyles.css';

export default function ProveedorForm (props) {
 
  var forMode = typeof(props.editForm) == 'string' && props.editForm.includes('updt')? 'update':'create'
  useEffect(()=>{
   if(forMode == 'update') {
    setTimeout(()=>{
     fetch(`http://${window.location.hostname}:9001/proveedor/`,{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({mode:'fillForm',code:props.editForm})
     })
     .then(re=>re.json())
     .then((re)=>{
      let descripcion = document.getElementsByClassName('descripcion')[0] 
      descripcion.value = re[0].Descripcion
      descripcion.focus()      
  })},100) } },[])  

 function handleSend(e) {
  let descripcion = document.getElementsByClassName('editForm')[0].descripcion.value.replace(' ','').trim()
  if(descripcion.length) { 
   var recordCode = forMode == 'update'? props.editForm:''    
   fetch(`http://${window.location.hostname}:9001/proveedor/`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({mode:forMode,payload:descripcion,recordCode})
  })
  .then(re=>re.json())
  .then((re)=>{if(re['msg'] == 'ok'){props.setEditForm(false)}})
 }} 

 return (
  <div className='formMainCont'>
   <div className='formInnerCont'>
     <form className='editForm'>
      <button className='editFormActionsButton' onClick={(e)=>{e.preventDefault();props.setEditForm(false)}} style={{'marginRight':'18px'}}>Cerrar</button>      
      <button className='editFormActionsButton' onClick={(e)=>{e.preventDefault();handleSend(e)}}>Guardar datos</button>
      <h1 className='formsTitle'>Crear o modificar Proveedor</h1>
      <h5 className='loginLabel'>Descripción:</h5> 
      <input type='text' className='loginInput descripcion' name='descripcion' required={true} style={{'paddingLeft':'8px'}}></input>
     </form>
   </div>
  </div>     
 )}
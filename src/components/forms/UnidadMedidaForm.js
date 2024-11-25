import {useState,useRef} from 'react';
import './formStyles.css';

export default function UnidadMedidaForm(props) {
 
 function handleSend(e) {
  let descripcion = document.getElementsByClassName('editForm')[0].descripcion.value.replace(' ','').trim()
  if(descripcion.length) { 
  fetch(`http://${window.location.hostname}:8001/unidadmedida/`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({mode:'create',payload:descripcion})
  })
  .then(re=>re.json())
  .then((re)=>{if(re['msg'] == 'ok'){props.setEditForm(false)}})
 }}   

 return (
  <div className='formMainCont'>
   <div className='formInnerCont'>
     <form className='editForm'>
      <h2>Proveedor</h2>
      <h3 className='loginLabel'>Descripción:</h3> 
      <input type='text' className='loginInput descripcion' name='descripcion' required={true}></input>
      <br/>
      <br/>
      <br/>
      <button className='editFormActionsButton' onClick={(e)=>{e.preventDefault();handleSend(e)}}>Aceptar</button>
      <br/>
      <button className='editFormActionsButton' onClick={(e)=>{e.preventDefault();props.setEditForm(false)}}>Cerrar</button>
     </form>
   </div>
  </div>     
 )}
import {useState,useRef,useEffect} from 'react';
import './formStyles.css';

export default function EstadoMaterialForm (props) {
 
 var forMode = typeof(props.editForm) == 'string' && props.editForm.includes('updt')? 'update':'create'
  useEffect(()=>{
   if(forMode == 'update') {
    setTimeout(()=>{
     fetch(`http://${window.location.hostname}:8001/estadomaterial/`,{
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
   fetch(`http://${window.location.hostname}:8001/estadomaterial/`,{
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
     <button className='editFormActionsButton' onClick={(e)=>{e.preventDefault();handleSend(e)}}>Guardar datos</button>
      <br/>
      <br/>
      <br/>
      <button className='editFormActionsButton' onClick={(e)=>{e.preventDefault();props.setEditForm(false)}} style={{'display':'block'}}>Cerrar</button>      
      <h1>Crear o modificar Estado del Material</h1>
      <h3 className='loginLabel'>Descripción:</h3> 
      <input type='text' className='loginInput descripcion' name='descripcion' required={true}></input>
     </form>
   </div>
  </div>     
 )}
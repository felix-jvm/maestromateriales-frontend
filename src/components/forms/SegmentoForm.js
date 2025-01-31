import {useState,useRef,useEffect} from 'react';
import './formStyles.css';

export default function SegmentoForm (props) {
 
 var forMode = typeof(props.editForm) == 'string' && props.editForm.includes('updt')? 'update':'create'
  useEffect(()=>{
   if(forMode == 'update') {
    setTimeout(()=>{
     fetch(`http://${window.location.hostname}:8001/segmento/`,{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({mode:'fillForm',code:props.editForm})
     })
     .then(re=>re.json())
     .then((re)=>{
      let codigo = document.getElementsByClassName('codigo')[0]  
      let descripcion = document.getElementsByClassName('descripcion')[0] 
      codigo.value = re[0].Codigo
      descripcion.value = re[0].Descripcion
      codigo.focus()
 })},100) } },[])

 function handleSend(e) {
  let codigo = document.getElementsByClassName('editForm')[0].codigo.value.trim()    
  let descripcion = document.getElementsByClassName('editForm')[0].descripcion.value.trim()
  if(descripcion.length && codigo.length) { 
   var recordCode = forMode == 'update'? props.editForm:''    
   fetch(`http://${window.location.hostname}:8001/segmento/`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({mode:forMode,payload:{codigo,descripcion},recordCode})
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
      <h1 className='formsTitle'>Crear o modificar segmento</h1>
      <h5 className='loginLabel'>Código:</h5> 
      <input type='text' className='loginInput codigo' name='codigo' required={true} style={{'paddingLeft':'8px','minWidth':'20%','maxWidth':'20%'}} maxLength='2'></input>      
      <h5 className='loginLabel'>Descripción:</h5> 
      <input type='text' className='loginInput descripcion' name='descripcion' required={true} style={{'paddingLeft':'8px'}}></input>
     </form>
   </div>
  </div>     
 )}
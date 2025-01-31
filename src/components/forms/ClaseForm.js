import {useState,useRef,useEffect} from 'react';
import './formStyles.css';

export default function SegmentoForm (props) { 
  var forMode = typeof(props.editForm) == 'string' && props.editForm.includes('updt')? 'update':'create';
  useEffect(()=>{
    setTimeout(()=>{
     fetch(`http://${window.location.hostname}:8001/familia/`,{method:'POST','headers':{'Content-Type':'application/json'},body:JSON.stringify({mode:'reqTableSeqRecords'})})
      .then(e=>e.json())
      .then(e=>{
        let claseFamilia = document.getElementsByClassName('claseFamilia')[0]
        for(let optionRecord of e) {
        let option = document.createElement('option')
        option.value = optionRecord['Codigo']
        option.innerText = `${optionRecord['Codigo']} - ${optionRecord['Descripcion']}`
        claseFamilia.appendChild(option)
        if(forMode=='create'){claseFamilia.value = ''}        
     }})                       
     if(forMode == 'update') {        
      fetch(`http://${window.location.hostname}:8001/clase/`,{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({mode:'fillForm',code:props.editForm})
      })
      .then(re=>re.json())
      .then((re)=>{
       let claseFamilia = document.getElementsByClassName('claseFamilia')[0]  
       let codigo = document.getElementsByClassName('codigo')[0]  
       let descripcion = document.getElementsByClassName('descripcion')[0] 
       codigo.value = re[0].Codigo
       descripcion.value = re[0].Descripcion
       codigo.focus()
       claseFamilia.value = re[0].Familia   
    })}},100)  },[])

 function handleSend(e) {
  let codigo = document.getElementsByClassName('editForm')[0].codigo.value.trim()   
  let familia = document.getElementsByClassName('editForm')[0].claseFamilia.value.trim() 
  let descripcion = document.getElementsByClassName('editForm')[0].descripcion.value.trim()
  if(descripcion.length && familia.length && codigo.length) { 
   var recordCode = forMode == 'update'? props.editForm:''    
   fetch(`http://${window.location.hostname}:8001/clase/`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({mode:forMode,payload:{codigo,descripcion,familia},recordCode})
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
      <h1 className='formsTitle'>Crear o modificar clase</h1>
      <h5 className='loginLabel'>Código:</h5> 
      <input type='text' className='loginInput codigo' name='codigo' required={true} style={{'paddingLeft':'8px','minWidth':'20%','maxWidth':'20%','minHeight':'45px','maxHeight':'45px'}} maxLength='2'></input>      
      <h5 className='loginLabel'>Familia a la que pertenece:</h5>
      <select name='claseFamilia' className='sameLineInput claseFamilia'  required={true} style={{'padding':'0 0 0 5px','minHeight':'45px','maxHeight':'45px','minWidth':'30%','maxWidth':'30%','margin':'2px 0 0 0'}}></select>
      <h5 className='loginLabel'>Descripción:</h5> 
      <input type='text' className='loginInput descripcion' name='descripcion' required={true} style={{'paddingLeft':'8px'}}></input>
     </form>
   </div>
  </div>     
 )}
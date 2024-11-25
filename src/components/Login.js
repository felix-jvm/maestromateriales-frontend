import './Login.css';
import Modal from './Modal';
import {useEffect,useState} from 'react';

export default function Login(props) {
 const [modal,setModal] = useState(false)

 setTimeout(()=>{
  if(props.mode=='userCreation') {
    let loginUserType = document.getElementsByClassName('userType')[0]
    let option1 = document.createElement('option')
    let option2 = document.createElement('option')
    option1.value = 1
    option2.value = 2
    option1.innerText = 'Usuario normal'
    option2.innerText = 'Administrador'
    loginUserType.appendChild(option1)
    loginUserType.appendChild(option2)
    loginUserType.value = ''
  }},100)

 function handleSend (e) {
  let authForm = document.getElementsByClassName('authForm')[0]
  let user = authForm.user.value.replace(' ','').trim()
  let password = authForm.password.value.replace(' ','').trim()
  let userType = authForm.userType? authForm.userType.value:undefined
  if((props.mode=='login' && user.length && password.length) || (props.mode=='userCreation' && user.length && password.length && userType)) {  
   let payload = {'username':user,'password':password} 
   props.mode=='userCreation'? payload['permisonivel']=userType:void 0
   e.preventDefault()
   setModal(true)
   fetch(`http://${window.location.hostname}:8001/usuario/`,{
    'method':'POST',
    'headers':{'Content-Type':'application/json'},
    'body':JSON.stringify({'cred':payload,'mode':props.mode})
    })
    .then(re=>re.json())
    .then(re=>{
     setModal(false) 
     if(props.mode == 'login' && re.msg == 'ok') {props.setHome(true);props.setUserData(re)} 
     else if (props.mode == 'login' && !re.length) {alert('Usuario o contraseña incorrecto')}
     if(props.mode == 'userCreation' && re.msg == 'ok') {props.setUserCreation(false)} })
  } } 
 
 return (
  <div className='loginMaintCont'>
    <h1 className='loginTitle'>{(props.mode=='login' && 'Inicio de sesión') || (props.mode=='userCreation' && 'Creación de usuario')}</h1>
    <form className='authForm'>

     <h3 className='loginLabel'>Usuario:</h3> 
     <input type='text' className='loginInput' name='user' required={true}></input>
     
     <h3 className='loginLabel'>Contraseña:</h3>      
     <input type='password' className='loginInput' name='password' required={true}></input>

     {props.mode=='userCreation' && <h3 className='loginLabel'>Tipo de usuario:</h3>}      
     {props.mode=='userCreation' && <select className='loginInput userType' name='userType' required></select>}

     <br/>     
     <br/>
     {(props.mode=='login' && <a href=''>Olvidó su contraseña</a>)}
     <br/>
     <button className='saveProcButton' onClick={(e)=>{handleSend(e)}}>Aceptar</button>
     {props.mode=='userCreation' && <button className='saveProcButton' onClick={(e)=>{props.setUserCreation(false)}} style={{'float':'right','marginRight':'6px'}}>Cerrar</button>}
    </form>
    {modal && <Modal displayInnerCont={false} mainContColor={'rgb(229, 229, 229,0.1)'}/>}
  </div>
 )   
}
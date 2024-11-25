import './Modal.css'

export default function Modal(props) {
 
 return (
  <div className = 'modalMainCont' style={{'backgroundColor':`${props.mainContColor}`}}>
    {props.displayInnerCont && <div className = 'modalInnerCont' style={{'backgroundColor':`${props.InnerContColor}`}}>
      <br/>
      <h2 className='modalMessage'>{props.message}</h2>  
       <div className='iconDiv'>  
        {props.icon}
       </div> 
      <input type = 'submit' className = 'modalConfirmationButton' value='Cerrar' onClick={() => {
        props.setModal('');
        props.reload==='true'?window.location.reload():void 0}}/>
    </div>}
  </div> 
 )   
}
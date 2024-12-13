import './inlineForms.css';

export default function InlineUnidadMedidaForm(props) {

    setTimeout(()=>{
     let inlineDescripcion = document.getElementsByClassName('inlineDescripcion')[0]
     inlineDescripcion.focus()   
    },100)

    function handleSend() {
     let inlineDescripcion = document.getElementsByClassName('inlineForm')[0].inlineDescripcion.value
     let route = props.inlineForm.split(',')[0]
     if(inlineDescripcion && route) {
      fetch(`http://${window.location.hostname}:8001/${route}/`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({'mode':'create','payload':inlineDescripcion})
      })
      .then((re)=>re.json())
      .then((re)=>{
        if(re['msg']=='ok') {
         let selectClass = props.inlineForm? props.inlineForm.split(',')[1]:false
         let selectElement = document.getElementsByClassName(selectClass)[0]
         let newOption = document.createElement('option')
         newOption.value = re['ID']
         newOption.innerText = re['Descripcion']
         newOption.selected = true
         selectElement.appendChild(newOption)
         props.payload.current[selectClass] = re['ID']
        } })}
     props.setInlineForm(false)
    }
  
    return (
     <div className='inlineFormOutterCont'>
      <div className='inlineFormInnerCont'>
       <form className='inlineForm'>
        <button className='inlineSaveProcButton' onClick={(e)=>{e.preventDefault();props.setInlineForm(false)}}>Cerrar</button>
        <button className='inlineSaveProcButton' onClick={(e)=>{e.preventDefault();handleSend(props.inlineForm)}}>Agregar</button>
        <h2 className='inlineLoginTitle' >Nueva Unidad de medida</h2>  
        <input type='text' className='inlineFormInput inlineDescripcion' name='inlineDescripcion' required={true} placeholder='Descripción'></input>
       </form>  
      </div>
     </div> 
    )}
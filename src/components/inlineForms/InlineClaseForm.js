import './inlineForms.css';

export default function InlineClaseForm(props) {

    setTimeout(()=>{
     fetch(`http://${window.location.hostname}:9001/familia/`,{method:'POST','headers':{'Content-Type':'application/json'},body:JSON.stringify({mode:'reqTableSeqRecords'})})
      .then(e=>e.json())
      .then(e=>{
          let inlineFamiliaSelect = document.getElementsByClassName('inlineFamiliaSelect')[0]
          for(let optionRecord of e) {            
          let option = document.createElement('option')
          option.value = optionRecord['Codigo']
          option.innerText = `${optionRecord['Codigo']} - ${optionRecord['Descripcion']}`
          inlineFamiliaSelect.appendChild(option)
          inlineFamiliaSelect.value = ''      
      }})        
     let inlineCodigo = document.getElementsByClassName('inlineCodigo')[0]
     inlineCodigo.focus()   
    },100)

    function handleSend() {
     let inlineCodigo = document.getElementsByClassName('inlineForm')[0].inlineCodigo.value        
     let inlineFamiliaSelect = document.getElementsByClassName('inlineForm')[0].inlineFamiliaSelect.value     
     let inlineDescripcion = document.getElementsByClassName('inlineForm')[0].inlineDescripcion.value
     let selectClass = props.inlineForm? props.inlineForm.split(',')[1]:false
     let selectElement = document.getElementsByClassName(selectClass)[0] 

     let codigo = document.getElementsByClassName('Codigo')[0]
     let route = props.inlineForm.split(',')[0]
     if(inlineCodigo && inlineFamiliaSelect && inlineDescripcion && route) {
      let payload = {'codigo':inlineCodigo,'familia':inlineFamiliaSelect,'descripcion':inlineDescripcion}
      fetch(`http://${window.location.hostname}:9001/${route}/`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({'mode':'create','payload':payload})
      })
      .then((re)=>re.json())
      .then((re)=>{
        if(re['msg']=='ok') {
         let newOption = document.createElement('option')
         newOption.value = re['ID']
         newOption.innerText = `${re['Codigo']} - ${re['Descripcion']}`
         newOption.selected = true
         selectElement.appendChild(newOption)
        } })
        
        setTimeout(()=>{
            payload = {'payload':selectElement.value,'mode':'reqSeqCode'}
            fetch(`http://${window.location.hostname}:9001/producto/`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(payload)
               })
               .then(e=>e.json())
               .then(e=>{if(e['seq']) {codigo.value = e['seq']} })            
        },100)
        }
     props.setInlineForm(false)
    }
  
    return (
     <div className='inlineFormOutterCont'>
      <div className='inlineFormInnerCont'>
       <form className='inlineForm'>
        <button className='inlineSaveProcButton' onClick={(e)=>{e.preventDefault();props.setInlineForm(false)}}>Cerrar</button>
        <button className='inlineSaveProcButton' onClick={(e)=>{e.preventDefault();handleSend(props.inlineForm)}}>Agregar</button>
        <h2 className='inlineLoginTitle' >Nueva clase</h2>  
        <h5 className='loginLabel'>Código:</h5> 
        <input type='text' className='inlineFormInput inlineCodigo' name='inlineCodigo' required={true} placeholder='Código' style={{'maxWidth':'10%','minWidth':'10%'}} maxLength='2'></input>
        <br/>
        <h5 className='loginLabel'>Familia a la que pertenece:</h5>
        <select name='inlineFamiliaSelect' className='sameLineInput inlineFamiliaSelect'  required={true} style={{'padding':'0 0 0 5px','minHeight':'45px','maxHeight':'45px','minWidth':'30%','maxWidth':'30%','margin':'2px 0 0 0'}}></select>        
        <br/>
        <h5 className='loginLabel'>Descripción:</h5> 
        <input type='text' className='inlineFormInput inlineDescripcion' name='inlineDescripcion' required={true} placeholder='Descripción'></input>
       </form>  
      </div>
     </div>
    )}
import './inlineForms.css';

export default function InlineFamiliaForm(props) {

    setTimeout(()=>{
     fetch(`http://${window.location.hostname}:9001/segmento/`,{method:'POST','headers':{'Content-Type':'application/json'},body:JSON.stringify({mode:'reqTableSeqRecords'})})
      .then(e=>e.json())
      .then(e=>{
          let inlineSegmentoSelect = document.getElementsByClassName('inlineSegmentoSelect')[0]
          for(let optionRecord of e) {            
          let option = document.createElement('option')
          option.value = optionRecord['Codigo']
          option.innerText = `${optionRecord['Codigo']} - ${optionRecord['Descripcion']}`
          inlineSegmentoSelect.appendChild(option)
          inlineSegmentoSelect.value = ''      
      }})        
     let inlineCodigo = document.getElementsByClassName('inlineCodigo')[0]
     inlineCodigo.focus()   
    },100)

    function handleSend() {
     let inlineCodigo = document.getElementsByClassName('inlineForm')[0].inlineCodigo.value        
     let inlineSegmentoSelect = document.getElementsByClassName('inlineForm')[0].inlineSegmentoSelect.value     
     let inlineDescripcion = document.getElementsByClassName('inlineForm')[0].inlineDescripcion.value
     let route = props.inlineForm.split(',')[0]
     if(inlineCodigo && inlineSegmentoSelect && inlineDescripcion && route) {
      let payload = {'codigo':inlineCodigo,'segmento':inlineSegmentoSelect,'descripcion':inlineDescripcion}
      fetch(`http://${window.location.hostname}:9001/${route}/`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({'mode':'create','payload':payload})
      })
      .then((re)=>re.json())
      .then((re)=>{
        if(re['msg']=='ok') {
         let selectClass = props.inlineForm? props.inlineForm.split(',')[1]:false
         let selectElement = document.getElementsByClassName(selectClass)[0] 
         let newOption = document.createElement('option')
         newOption.value = re['ID']
         newOption.innerText = `${re['Codigo']} - ${re['Descripcion']}`
         newOption.selected = true
         selectElement.appendChild(newOption)
        } })}
     props.setInlineForm(false)
    }
  
    return (
     <div className='inlineFormOutterCont'>
      <div className='inlineFormInnerCont'>
       <form className='inlineForm'>
        <button className='inlineSaveProcButton' onClick={(e)=>{e.preventDefault();props.setInlineForm(false)}}>Cerrar</button>
        <button className='inlineSaveProcButton' onClick={(e)=>{e.preventDefault();handleSend(props.inlineForm)}}>Agregar</button>
        <h2 className='inlineLoginTitle' >Nueva familia</h2>  
        <h5 className='loginLabel'>Código:</h5> 
        <input type='text' className='inlineFormInput inlineCodigo' name='inlineCodigo' required={true} placeholder='Código' style={{'maxWidth':'10%','minWidth':'10%'}} maxLength='2'></input>
        <br/>
        <h5 className='loginLabel'>Segmento al que pertenece:</h5>
        <select name='inlineSegmentoSelect' className='sameLineInput inlineSegmentoSelect'  required={true} style={{'padding':'0 0 0 5px','minHeight':'45px','maxHeight':'45px','minWidth':'30%','maxWidth':'30%','margin':'2px 0 0 0'}}></select>        
        <br/>
        <h5 className='loginLabel'>Descripción:</h5> 
        <input type='text' className='inlineFormInput inlineDescripcion' name='inlineDescripcion' required={true} placeholder='Descripción'></input>
       </form>  
      </div>
     </div>
    )}
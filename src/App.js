import './App.css';
import Login from './components/Login';
import DataCont from './components/DataCont';
import {useState,useEffect} from 'react';

function App() {
  const [home,setHome] = useState(false);
  const [userCreation,setUserCreation] = useState(false);
  const [userData,setUserData] = useState(false);
  useEffect(()=>{if(!userData){setHome(false)}},[userData])
  return (
   <div className="App">
    {(!home && !userData && <Login setHome={setHome} setUserData={setUserData} mode={'login'}/>) || 
    (home && userData && <DataCont setUserCreation={setUserCreation} userData={userData} setUserData={setUserData}/>)}
    {userCreation && <div className='outerLoginCont'><Login setUserCreation={setUserCreation} mode={'userCreation'}/></div>}
   </div>
  );
}

export default App;

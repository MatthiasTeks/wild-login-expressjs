
import axios from 'axios';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import './App.css';

function App() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const body = { mail, password };
    
    try {
      const response = await axios.post('http://localhost:4242/user/login', body, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      if(response.status === 200) {
        localStorage.setItem('token', `Bearer ${response.data}`)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }
  
  return (
    <main>
      <form onSubmit={(e) => handleSubmit(e)}>
        <h2>Learn Register</h2>
        <InputText value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Mail" />
        <Password value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" feedback={false} />
        <Button type="submit" label="Register" />
        <button onClick={() => console.log(localStorage.getItem('token'))}>CLICK TEST</button>
      </form>
      {isLoading && <ProgressSpinner />}
    </main>
  );
}

export default App;

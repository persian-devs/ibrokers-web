import '../index.css';
import logologin from '../assets/img/logo-list.png'
import axios from 'axios';
import { useState } from 'react';
import { getToken ,saveToken} from '../localstorage/token';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function Login () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      try {
        const response = await axios.post('https://panel.ibrokers.ir/api/account/login/', {
          username: username,
          password: password,
        });
  
        if (response.status === 200) {
          console.log(response.data['access']);
          const token = response.data['access']; 
          saveToken(token)
          // setAccessToken(token);
          navigate('/')
          console.log('ورود موفقیت‌آمیز. توکن:', token);

        } else {
          console.log('ورود ناموفق. وضعیت:', response.status);
        }
      } catch (error) {
        console.error( error);
        toast.error('نام کاربری یا کلمه عبور اشتباه است');
      }
    };
    return(
        <>
            <div className='login'>
                <div className='inset-login'>
                    <img src={logologin} />
                    
                    <p>ورود به حساب کاربری</p>

                    <label> : نام کاربری</label>
                    <input 
                        className='input-login' 
                        type='text' 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />

                    <label> : رمز عبور </label>
                    <input 
                        className='input-login' 
                        type='password' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    
                    <button className='btn-login' onClick={handleLogin}>ورود</button>
                </div>
            </div>
        </>
    )
}
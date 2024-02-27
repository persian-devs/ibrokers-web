import '../index.css';
import logologin from '../assets/img/logo-list.png'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getToken ,saveToken} from '../localstorage/token';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

export function Login () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
   

    useEffect(() => {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }, []);
  
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
          navigate('/home')
          console.log('ورود موفقیت‌آمیز. توکن:', token);

        } else {
          console.log('ورود ناموفق. وضعیت:', response.status);
          setLoginError('نام کاربری یا کلمه عبور اشتباه است');

        }
      } catch (error) {
        console.error( error);
        setLoginError('نام کاربری یا کلمه عبور اشتباه است');
      }
    };
    return(
        <>
            <div className='login'>
                <div className='inset-login'>
                    <img src={logologin} />
                    
                    <p>ورود به حساب کاربری</p>
                    <span style={{
                      color: 'red',
                      fontFamily: 'sans',
                    }}>{loginError}</span>

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
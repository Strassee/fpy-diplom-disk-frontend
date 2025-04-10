import './Login.css';
import { useState, useRef } from 'react';
import Tooltip from '../Tooltip/Tooltip';
import checkValidityForm from '../Other/checkValidityForm';
import useRequest from "../Other/useRequest"
import useDispatching from "../Other/useDispatching";
import getCookie  from "../Other/getCookie";
import findFormErrorElement  from "../Other/findFormErrorElement";

function Login() {
  const form = useRef(null);
  const { request }= useRequest();
  const { dispatching }= useDispatching();
  const[stateForm, setStateForm]=useState({username: '', password: ''});
  const[tooltip, setTooltip]=useState({error: '', element: ''});
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const patternsInput = {
    username: /^[A-Za-z]+[A-Za-z0-9]*$/g,   // Тестирование логина
    password: /[0-9a-zA-Z!@#$%^&*()—_+=;:,.\/?\\|`~\[\]\{\}]{1,}/g,   // Тестирование пароля https://ru.stackoverflow.com/questions/533675/%D0%A0%D0%B5%D0%B3%D1%83%D0%BB%D1%8F%D1%80%D0%BD%D0%BE%D0%B5-%D0%B2%D1%8B%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%B0%D1%80%D0%BE%D0%BB%D1%8F-%D0%BE%D1%82-6-%D1%81%D0%B8%D0%BC%D0%B2%D0%BE%D0%BB%D0%BE%D0%B2-%D1%81-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC-%D1%86%D0%B8%D1%84%D1%80-%D1%81%D0%BF%D0%B5%D1%86-%D1%81%D0%B8%D0%BC%D0%B2%D0%BE
  }

  const errors = {
    username: {
      customError: 'Логин не удовлетворяет требованиям',
      valueMissing: 'Введите логин',
    },
    password: {
      customError: 'Пароль не удовлетворяет требованиям',
      valueMissing: 'Введите пароль',
    },
  }

  const handleState = (e) => {
    const {name, value} = e.target;
    switch (name) {
      case 'username':
        if (value.length <= 20) {
          setStateForm((prevForm) => ({...prevForm, [name]: value}));
        }
        break;
      default:
        setStateForm((prevForm) => ({...prevForm, [name]: value}));       
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(checkValidityForm(form.current, errors, stateForm, setStateForm, setTooltip, patternsInput)) {
      let formData = new FormData(e.target)
      setLoading(true)
      const result = await request('POST', process.env.REACT_APP_SERVER_HOST + '/api/user/login/', Object.fromEntries(formData), getCookie('csrftoken'))
      if(result['errors']) {
        findFormErrorElement(result['errors'], form.current, setTooltip);
        return;
      }
      if(result['status login']) {
        dispatching(result['status login'], result['admin'], result['user'], result['storage'], getCookie('csrftoken'))
      }
      setLoading(false)
      setError(result.error)
    }
  }

  return (
    <div className="login">
       <div className='form'>
      {error? <p>{error}</p> : null}
      {/* {!isLoggedIn ? */}
          {/* { loading ? "Загрузка..." : */}
            <form onSubmit={handleSubmit} noValidate ref={form}>
              <div className="input__box">
                <label className='label-input' htmlFor="username">
                  <div className='label-title'>Логин:</div>
                </label>
                <input className='input-text' type="text" value={stateForm.username}  id="username" name="username" placeholder="Login" minLength="1" onInput={handleState} required />
              </div>
              <div className="input__box">
                <label className='label-input' htmlFor="password">
                  <div className='label-title'>Пароль:</div>
                </label>
                <input className='input-text' type="password" value={stateForm.password} id="password" name="password" placeholder="Password" minLength="1" onInput={handleState} required />
              </div>
              <div className='submit'>
                <input className='btn-submit' type="submit" value='OK' />
              </div>
            </form>
             {/* } */}
            {/* : navigate("/panel")} */ }
          </div> 
      {tooltip.error !== '' ? <Tooltip message={tooltip.error} element={tooltip.element} /> : ''}
    </div>
  )
}

export default Login;
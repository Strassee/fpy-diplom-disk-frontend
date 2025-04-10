import './Registration.css';
import { useState, useRef } from 'react';
import Tooltip from '../Tooltip/Tooltip';
import checkValidityForm from '../Other/checkValidityForm';
import useRequest from "../Other/useRequest"
import useDispatching from "../Other/useDispatching";
import getCookie  from "../Other/getCookie";
import findFormErrorElement  from "../Other/findFormErrorElement";

function Registration() {
  const form = useRef(null);
  const { request }= useRequest();
  const { dispatching }= useDispatching();
  const[tooltip, setTooltip]=useState({error: '', element: ''});
  const[stateForm, setStateForm]=useState({username: '', first_name: '', email: '', password: ''});

  const patternsInput = {
    username: /^(?=.{4,20}$)[A-Za-z]+[A-Za-z0-9]*$/g,   // Тестирование логина
    first_name: /^(?=.{2,20}$)[A-Za-zА-Яа-я]+$/g,          // Тестирование имени
    email: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gi,   // Тестирование e-mail
    password: /(?=.*[0-9])(?=.*[!@#$%^&*()—_+=;:,.\/?\\|`~\[\]\{\}])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()—_+=;:,.\/?\\|`~\[\]\{\}]{6,}/g,   // Тестирование пароля https://ru.stackoverflow.com/questions/533675/%D0%A0%D0%B5%D0%B3%D1%83%D0%BB%D1%8F%D1%80%D0%BD%D0%BE%D0%B5-%D0%B2%D1%8B%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%B0%D1%80%D0%BE%D0%BB%D1%8F-%D0%BE%D1%82-6-%D1%81%D0%B8%D0%BC%D0%B2%D0%BE%D0%BB%D0%BE%D0%B2-%D1%81-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC-%D1%86%D0%B8%D1%84%D1%80-%D1%81%D0%BF%D0%B5%D1%86-%D1%81%D0%B8%D0%BC%D0%B2%D0%BE
  }

  const errors = {
    username: {
      customError: 'Логин не удовлетворяет требованиям',
      tooShort: 'Логин слишком короткий',
      valueMissing: 'Введите логин',
    },
    first_name: {
      customError: 'Имя не удовлетворяет требованиям',
      tooShort: 'Имя слишком короткое',
      valueMissing: 'Представьтесь, пожалуйста!',
    },
    email: {
      customError: 'E-mail не удовлетворяет требованиям',
      valueMissing: 'Введите Ваш e-mail',
      typeMismatch: 'Проверьте правильность e-mail',
    },
    password: {
      customError: 'Пароль не удовлетворяет требованиям',
      tooShort: 'Пароль слишком короткий',
      valueMissing: 'Введите пароль',
      patternMismatch: 'Пароль не соответствует требованиям безопасности',
    },
  }

  const handleState = (e) => {
    let {name, value} = e.target;
    switch (name) {
      case 'username' || 'first_name':
        if (value.length <= 20) {
          setStateForm((prevForm) => ({...prevForm, [name]: value}));
        }
        break;
      default:
        setStateForm((prevForm) => ({...prevForm, [name]: value}));       
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(checkValidityForm(form.current, errors, stateForm, setStateForm, setTooltip, patternsInput)) {
      let formData = new FormData(e.target)
      const result = await request('POST', process.env.REACT_APP_SERVER_HOST + '/api/user/reg/', Object.fromEntries(formData), getCookie('csrftoken'))
      if(result['errors']) {
        findFormErrorElement(result['errors'], form.current, setTooltip);
        return;
      }
      if(result['status login']) {
        dispatching(result['status login'], result['admin'], result['user'], result['storage'], getCookie('csrftoken'));
      }
    }
  }

  return (
    <div className="registration">
      <div className='form'>
        <form onSubmit={handleSubmit} noValidate ref={form}>
          <div className="input__box reg">
            <label className='label-input reg' htmlFor="username">
              <div className='label-title'>Логин:</div>
              <div className='label-hint'>(Латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов)</div>
            </label>
            <input className='input-text' type="text" value={stateForm.username}  id="username" name="username" placeholder="Login" minLength="4" maxLength="20" onInput={handleState} required />
          </div>
          <div className="input__box reg">
            <label className='label-input reg' htmlFor="first_name">
              <div className='label-title'>Имя:</div>
              <div className='label-hint'>(Только латинские или русские буквы, длина от 2 до 20 символов)</div>
            </label>
            <input className='input-text' type="text" value={stateForm.first_name} id="first_name" name="first_name" placeholder="Name" minLength="2" maxLength="20" onInput={handleState} required />
          </div>
          <div className="input__box reg">
            <label className='label-input reg' htmlFor="email">
              <div className='label-title'>E-mail:</div>
            </label>
            <input className='input-text' type="email" value={stateForm.email} id="email" name="email" placeholder="E-mail" onInput={handleState} required />
          </div>
          <div className="input__box reg">
            <label className='label-input reg' htmlFor="password">
              <div className='label-title'>Пароль:</div>
              <div className='label-hint'>(Не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ)</div>
            </label>
            <input className='input-text' type="password" value={stateForm.password} id="password" name="password" placeholder="Password"  onInput={handleState}  />
          </div>
          <div className='submit'>
            <input className='btn-submit' type="submit" value='OK' />
          </div>
        </form>
        </div>

        {tooltip.error !== '' ? <Tooltip message={tooltip.error} element={tooltip.element} /> : ''}
    </div>
  )
}

export default Registration;
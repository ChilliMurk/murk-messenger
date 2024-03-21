import React from "../index";
import {useState, createRef} from "react";
import {useNavigate} from 'react-router-dom';
import styles from '../styles/MainPage.module.css';
import {
    handleLogin, handleRegister
} from './Requests';

const MainPage = message => {
    const navigate = useNavigate();
    const wrapperRef = createRef();

    const [formData, setFormData] = useState({
        email: '', password: '', username: '', fullName: ''
    });

    const [loginData, setLoginData] = useState({
        email: '', password: ''
    });

    const handleRegisterClick = () => {
        wrapperRef.current.classList.add(styles.active);
    };

    const handleLoginClick = () => {
        wrapperRef.current.classList.remove(styles.active);
    };

    const handlePopupLoginClick = () => {
        wrapperRef.current.classList.remove(styles.active);
        wrapperRef.current.classList.add(styles.activePopup);
    };

    const handlePopupRegisterClick = () => {
        wrapperRef.current.classList.add(styles.active, styles.activePopup);
    };

    const handleCloseClick = () => {
        wrapperRef.current.classList.remove(styles.activePopup);
    };

    const handleLoginChange = (event) => {
        const {name, value} = event.target;
        setLoginData((prevData) => ({
            ...prevData, [name]: value
        }));
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevData) => ({
            ...prevData, [name]: value
        }));
    };

    const onSubmitLogin = async (event) => {
        const response = await handleLogin(event, loginData);
        if (response) {
            handleCloseClick();
            navigate('/messenger');
        } else {
            alert("Ошибка при входе! Проверьте правильность введенных данных.");
        }
    };

    const onSubmitRegister = async (event) => {
        const response = await handleRegister(event, formData);
        if (response) {
            handlePopupLoginClick();
        } else {
            alert("Ошибка при регистрации!");
        }
    };


    return <div>
        <div className={styles.mainPageBody}>
            <header className={styles.mainPageHeader}>
                <h2 className={styles.logo}>KiberMurk</h2>
                <nav className={styles.navigation}>
                    <a href="#" className={styles.btnRegPopup} onClick={handlePopupRegisterClick}>
                        Регистрация
                    </a>
                    <button className={styles.btnLoginPopup} onClick={handlePopupLoginClick}>
                        Вход
                    </button>
                </nav>
            </header>

            <div className={styles.wrapper} ref={wrapperRef}>
                <span className={styles.iconClose} onClick={handleCloseClick}>
                  <ion-icon name="close"/>
                </span>
                <div className={styles.formBox + " " + styles.login}>
                    <a>
                        <h2>Вход</h2>
                    </a>
                    <form action="#" onSubmit={onSubmitLogin}>
                        <div className={styles.inputBox}>
                            <span className={styles.icon}>
                              <ion-icon name="mail"/>
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                required
                            />
                            <label>Email</label>
                        </div>
                        <div className={styles.inputBox}>
                            <span className={styles.icon}>
                              <ion-icon name="lock-closed"/>
                            </span>
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />
                            <label>Пароль</label>
                        </div>
                        <div className={styles.rememberForgot}>
                            <label>
                                <input type="checkbox"/>Запомнить меня
                            </label>
                            <a href="#">Забыли пароль?</a>
                        </div>
                        <button type="submit" className={styles.btn2}>
                            Войти
                        </button>
                        <div className={styles.loginRegister}>
                            <p>
                                Нет аккаунта?{' '}
                                <a href="#" className={styles.registerLink} onClick={handleRegisterClick}>
                                    Зарегистрироваться
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
                <div className={styles.formBox + " " + styles.register}>
                    <a>
                        <h2>

                            <img src="img/Регистрация.png" alt="Регистрация"/>
                        </h2>
                    </a>
                    <form onSubmit={onSubmitRegister}>
                        <div className={styles.inputBox}>
                            <span className={styles.icon}>
                              <ion-icon name="person"/>
                            </span>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <label>Никнейм</label>
                        </div>
                        <div className={styles.inputBox}>
                            <span className={styles.icon}>
                              <ion-icon name="person"/>
                            </span>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <label>Полное имя</label>
                        </div>
                        <div className={styles.inputBox}>
                            <span className={styles.icon}>
                              <ion-icon name="mail"/>
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <label>Email</label>
                        </div>
                        <div className={styles.inputBox}>
                            <span className={styles.icon}>
                              <ion-icon name="lock-closed"/>
                            </span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <label>Пароль</label>
                        </div>
                        <div className={styles.rememberForgot}>
                            <label>
                                <input type="checkbox"/>Я согласен с правилами и условиями{' '}
                            </label>
                        </div>
                        <button type="submit" className={styles.btn2}>
                            Зарегистрироваться
                        </button>
                        <div className={styles.loginRegister}>
                            <p>
                                Есть аккаунт?{' '}
                                <a href="#" className={styles.loginLink} onClick={handleLoginClick}>
                                    Войти
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
}


export default MainPage;
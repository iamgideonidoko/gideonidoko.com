import { Fragment, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Login.module.css';
import SimpleReactValidator from 'simple-react-validator';
import { connect } from 'react-redux';
import { login } from '../store/actions/authActions';
//get alert library
import swal from 'sweetalert';
//get router
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

const Login = (props) => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [, forceUpdate] = useState();

    //instantiate the validator as a singleton
    const simpleValidator = useRef(
        new SimpleReactValidator({
            element: (message, className) => <div className={'formErrorMsg'}>{message}</div>,
        }),
    );

    //when the login form is submitted
    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (simpleValidator.current.allValid()) {
            //all input is valid

            //create admin user object
            const adminUser = {
                username,
                password,
            };

            //Attempt to login admin
            props.login(adminUser);
        } else {
            //input not valid, so show error
            simpleValidator.current.showMessages(); //show all errors if exist
            forceUpdate(1); //force update component to display error
        }
    };

    //when the input fields change
    const handleInputChange = (e) => {
        switch (e.target.name) {
            case 'username':
                setUsername(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
        }
    };

    if (props.isLoginFailed) {
        swal('Login failed!', 'Attempting to login failed! Make sure your input is correct and try again.', 'error');
    }

    return (
        <Fragment>
            <NextSeo noindex={true} nofollow={true} />
            <Head>
                <title>Login - Gideon Idoko</title>
            </Head>
            <main className={`padding-top-10rem`}>
                <div className="container-max-1248px">
                    {props.isAuthenticated ? (
                        <div className={`loginRedirectMsg`}>
                            <h1>You are logged in.</h1>
                            <p>Redirecting to profile page...</p>
                            {typeof window !== 'undefined' &&
                                window.setTimeout(() => {
                                    router.push('/admin');
                                }, 4000)}
                        </div>
                    ) : (
                        <Fragment>
                            <div className={styles.loginPageWrapper}>
                                <div className={styles.lpLeft}>
                                    <div>
                                        <form method="post" onSubmit={handleFormSubmit} className={styles.loginForm}>
                                            <div>
                                                <h2>Log in</h2>
                                                <div className={styles.usernameFC}>
                                                    <label htmlFor="">Enter Username</label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        value={username}
                                                        onChange={handleInputChange}
                                                        required={true}
                                                    />
                                                    {
                                                        /* simple validation */
                                                        simpleValidator.current.message(
                                                            'username',
                                                            username,
                                                            'required|alpha_num|between:4,25',
                                                        )
                                                    }
                                                </div>
                                                <div className={styles.passwordFC}>
                                                    <label htmlFor="">Enter Password</label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={password}
                                                        onChange={handleInputChange}
                                                        required={true}
                                                    />
                                                    {
                                                        /* simple validation */
                                                        simpleValidator.current.message(
                                                            'password',
                                                            password,
                                                            'required|between:4,25',
                                                        )
                                                    }
                                                </div>
                                                <div className={styles.submitFC}>
                                                    <input
                                                        type="submit"
                                                        name="submit"
                                                        value={
                                                            props.isAttemptingLogin ? 'Attempting Login...' : 'Log in'
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className={styles.lpRight}>
                                    <div className={styles.lpRightImgWrapper}>
                                        {/*

									<img src="/assets/img/Oreti.png" alt="oreti pattern" />
									//pattern added as background to this element
									
									*/}
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )}
                </div>
            </main>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    isAttemptingLogin: state.auth.isAttemptingLogin,
    isLoginFailed: state.auth.isLoginFailed,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);

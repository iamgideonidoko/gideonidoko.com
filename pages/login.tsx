import { Fragment, useRef, useState, FormEvent, ChangeEvent, ChangeEventHandler } from 'react';
import styles from '../styles/Login.module.css';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, getUserGithubInfo } from '../store/slice/auth.slice';
import { RootState } from '../store/store';

const Login = ({}) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isAttemptingLogin, setIsAttemptingLogin] = useState<boolean>(false);
    const [, forceUpdate] = useState<number>();

    const isAuthenticated = useSelector((state: RootState) => state?.auth?.isAuthenticated);

    //instantiate the validator as a singleton
    const simpleValidator = useRef(
        new SimpleReactValidator({
            element: (message: string) => <div className={'formErrorMsg'}>{message}</div>,
        }),
    );

    //when the login form is submitted
    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (simpleValidator.current.allValid()) {
            //all input is valid
            setIsAttemptingLogin(true);

            //create admin user object
            const adminUser = {
                username,
                password,
            };

            //Attempt to login admin
            dispatch(
                loginUser({
                    body: adminUser,
                    success(payload) {
                        dispatch(getUserGithubInfo({ githubusername: payload?.data?.user?.user?.githubusername }));
                    },
                    failed() {
                        setIsAttemptingLogin(false);
                        swal('Login failed!', 'Incorrect credentials', 'error');
                    },
                }),
            );
        } else {
            //input not valid, so show error
            simpleValidator.current.showMessages(); //show all errors if exist
            forceUpdate(1); //force update component to display error
        }
    };

    //when the input fields change
    const handleInputChange: ChangeEventHandler = (e: ChangeEvent<HTMLFormElement>) => {
        switch (e.target.name) {
            case 'username':
                setUsername(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
        }
    };

    return (
        <Fragment>
            <NextSeo title="Login - Gideon Idoko" noindex={true} nofollow={true} />
            <main className={`padding-top-10rem`}>
                <div className="container-max-1248px">
                    {isAuthenticated ? (
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
                                                        value={isAttemptingLogin ? 'Attempting Login...' : 'Log in'}
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

export default Login;

import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from '../../firebaseConfig';
import './login.css';
import { useNavigate } from 'react-router-dom';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleEmailPasswordLogin = async (event) => {
        event.preventDefault();

        try {
            // Sign in the user with email/password
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

            console.log('Logged in with email and password successfull:', userCredential.user);
            // Redirect to the landing page after successful login
            navigate("/") // Replace '/landing' with the actual path of your landing page
        } catch (error) {
            console.log('Email/password login failure:', error.message);
            setLoginError('Invalid email or password.');
        }
    };
    const handleGoogleLoginSuccess = async (response) => {
        // Sign in the user with Google
        const credential = firebase.auth.GoogleAuthProvider.credential(response.tokenId);
        const userCredential = await firebase.auth().signInWithCredential(credential);

        console.log('Logged in with Google:', userCredential.user);
        // You can redirect to the main page or handle the login success here
    };

    const handleGoogleLoginFailure = (error) => {
        console.log('Google login failure:', error);
        // Handle the login failure here
    };

    const handleFacebookLoginSuccess = async (response) => {
        // Sign in the user with Facebook
        const credential = firebase.auth.FacebookAuthProvider.credential(response.accessToken);
        const userCredential = await firebase.auth().signInWithCredential(credential);

        console.log('Logged in with Facebook:', userCredential.user);
        // You can redirect to the main page or handle the login success here
    };

    const handleFacebookLoginFailure = (error) => {
        console.log('Facebook login failure:', error);
        // Handle the login failure here
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
                <form onSubmit={handleEmailPasswordLogin}>
                    {/* Email field */}
                    <label htmlFor="email-input">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        id="email-input"
                    />

                    {/* Password field */}
                    <label htmlFor="password-input">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        id="password-input"
                    />

                    {loginError && <div className="error">{loginError}</div>}

                    {/* Submit button */}
                    <button type="submit">Login</button>
                </form>

                <div className="social-buttons">
                    {/* Google Login */}
                    <GoogleLogin
                        clientId="171588375686-dbg2fdc4gkt3t0vevf85gsdmmg7n0f2r.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={handleGoogleLoginSuccess}
                        onFailure={handleGoogleLoginFailure}
                        cookiePolicy={'single_host_origin'}
                    />

                    {/* Facebook Login */}
                    <FacebookLogin
                        appId="6444597895621328"
                        fields="name,email,picture"
                        callback={handleFacebookLoginSuccess}
                        onFailure={handleFacebookLoginFailure}
                        cssClass="facebook-login-button"
                        textButton="Login with Facebook"
                        icon="fa-facebook"
                    />
                </div>
            </div>
            );
};

            export default Login;

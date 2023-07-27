import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import './register.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


const db = firebase.firestore();

const UserRegistration = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const [users, loading, error] = useCollectionData(
        db.collection('users').where('email', '==', email),
        { idField: 'id' }
    );

    const handleRegistration = async (event) => {
        event.preventDefault();

        // Check password strength
        if (!isStrongPassword(password)) {
            setPasswordError('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.');
            return;
        }

        try {
            // Sign up the user with email/password
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

            // Add the user's email to their Firestore document
            const userRef = db.collection('users').doc(userCredential.user.uid);
            userRef.set({
                username: username,
                email: email,
            });

            // Add Firebase Authentication code here
            console.log('User registered:', userCredential.user);
            navigate("/login")
        } catch (error) {
            console.log('Error registering user:', error);
        }
    };

    const isStrongPassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return passwordRegex.test(password);
    };

    const handleGoogleLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        const auth = firebase.auth();

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = firebase.auth.GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...

                console.log(token);
                console.log(user);
                navigate("/login")
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData?.email;
                // The AuthCredential type that was used.
                const credential = firebase.auth.GoogleAuthProvider.credentialFromError(error);

                console.log(errorCode);
                console.log(errorMessage);
                console.log(email);
                console.log(credential);

                alert(errorMessage);
            });
    };

    const handleGoogleRegisterFailure = (error) => {
        console.log('Facebook login failure:', error);
    };

    const handleFacebookLoginSuccess = async (response) => {
        // Sign in the user with Facebook
        const credential = firebase.auth.FacebookAuthProvider.credential(response.accessToken);
        const userCredential = await firebase.auth().signInWithCredential(credential);

        // Add the user's email to their Firestore document
        const userRef = db.collection('users').doc(userCredential.user.uid);
        userRef.set({
            email: userCredential.user.email,
        });
        navigate("/login")
    };

    const handleFacebookLoginFailure = (error) => {
        console.log('Facebook login failure:', error);
    };

    return (
        <div className="App">
            <h2>User Registration</h2>
            <form onSubmit={handleRegistration}>
                {/* Username field */}
                <label htmlFor="username-input">Username</label>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    id="username-input"
                />

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
                {passwordError && <div className="error">{passwordError}</div>}

                {/* Submit button */}
                <button type="submit" id="register-button">Register</button>


                {/* Google Login */}
                <div className="socialButtons">
                    <GoogleLogin
                        clientId="171588375686-dbg2fdc4gkt3t0vevf85gsdmmg7n0f2r.apps.googleusercontent.com"
                        buttonText="Register with Google"
                        onSuccess={handleGoogleLogin}
                        onFailure={handleGoogleRegisterFailure}
                        cookiePolicy={'single_host_origin'}
                        className="google-login-button"
                    />


                    {/* Facebook Login */}
                    <FacebookLogin
                        appId="6444597895621328"
                        fields="name,email,picture"
                        callback={handleFacebookLoginSuccess}
                        onFailure={handleFacebookLoginFailure}
                        cssClass="facebook-login-button"
                        textButton="Register with Facebook"
                        icon="fa-facebook"
                    />
                </div>
            </form >
        </div >
    );
};

export default UserRegistration;
import { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import SignupForm from '../components/Auth/SignupForm';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            id="tab-login"
            className={isLogin ? 'auth-tab active' : 'auth-tab'}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>
          <button
            id="tab-signup"
            className={!isLogin ? 'auth-tab active' : 'auth-tab'}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        {isLogin ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

export default Login;

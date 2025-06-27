import AuthCard from '../components/Auth/AuthCard';
import LoginForm from '../components/Auth/LoginForm';

function Login() {
  return (
    <div className="auth-container">
      <AuthCard
        title="Welcome Back"
        subtitle="Login to manage your expenses"
        formComponent={<LoginForm />}
        footerText="Don't have an account?"
        footerLink="/register"
        footerLinkText="Register"
      />
    </div>
  );
}

export default Login;

import AuthCard from '../components/Auth/AuthCard';
import RegisterForm from '../components/Auth/RegisterForm';

function Register() {
  return (
    <div className="auth-container">
      <AuthCard
        title="Create Account"
        subtitle="Join and start splitting smartly"
        formComponent={<RegisterForm />}
        footerText="Already have an account?"
        footerLink="/login"
        footerLinkText="Login"
      />
    </div>
  );
}

export default Register;

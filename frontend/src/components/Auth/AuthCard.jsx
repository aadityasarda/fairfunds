import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

function AuthCard({ title, subtitle, formComponent, footerText, footerLink, footerLinkText }) {
  const navigate = useNavigate();

  return (
    <div className="auth-card upgraded">
      <div className="auth-header">
        <div className="auth-logo">📝</div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {formComponent}

      <p className="auth-link">
        {footerText}{' '}
        <span onClick={() => navigate(footerLink)}>{footerLinkText}</span>
      </p>
    </div>
  );
}

export default AuthCard;

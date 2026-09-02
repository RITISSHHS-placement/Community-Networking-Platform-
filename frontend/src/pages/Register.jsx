import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Radar from '../components/Radar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { roleOptions } from '../data/mockData';

const NAME_RE = /^[A-Za-z ]{2,100}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;
const PW_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function Register() {
  const { registerAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Member');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function validateStep1() {
    const nextErrors = {
      name: !NAME_RE.test(name.trim()),
      email: !EMAIL_RE.test(email.trim()),
      phone: !PHONE_RE.test(phone.trim()),
    };
    setErrors((e) => ({ ...e, ...nextErrors }));
    return !nextErrors.name && !nextErrors.email && !nextErrors.phone;
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(3, s + 1));
  }
  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const pwOk = PW_RE.test(password);
    setErrors((er) => ({ ...er, password: !pwOk }));
    if (!pwOk) return;

    const result = await registerAccount({ name, role, email, phoneNumber: phone, password });
    if (!result.ok) {
      showToast(result.error || 'Registration failed');
      return;
    }

    setSuccess(true);
    showToast('Registration successful! Please verify your email.');
    setTimeout(() => {
      setSuccess(false);
      setStep(1);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      navigate('/login');
    }, 1800);
  }

  const pwScore = passwordScore(password);

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="eyebrow" style={{ color: 'var(--violet)' }}>Join the platform</div>
        <Radar
          center="✎"
          dots={[
            { top: '24%', left: '34%', variant: 'v3' },
            { top: '58%', left: '74%', variant: 'v2' },
          ]}
        />
        <p className="auth-quote">
          "Every organiser started as a member who <span>showed up first.</span>"
        </p>
      </div>
      <div className="auth-form-side">
        <div className="auth-card" style={{ maxWidth: 440 }}>
          <div className="eyebrow">Create account</div>
          <h2>Let's set you up</h2>
          <p className="sub">Step {step} of 3</p>

          <div className="stepper">
            <div className={`step-dot${step === 1 ? ' active' : ''}${step > 1 ? ' done' : ''}`}><i /></div>
            <div className={`step-dot${step === 2 ? ' active' : ''}${step > 2 ? ' done' : ''}`}><i /></div>
            <div className={`step-dot${step === 3 ? ' active' : ''}`}><i /></div>
          </div>

          <div className={`form-alert success${success ? ' show' : ''}`}>
            ✅ <span>Thank you for registering. Please verify your email.</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {step === 1 && (
              <div className="reg-step active">
                <div className={`field${errors.name ? ' has-error' : ''}`}>
                  <label htmlFor="regName">Full name</label>
                  <input
                    type="text"
                    id="regName"
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="err">Name must not contain numbers or special characters</div>
                </div>
                <div className={`field${errors.email ? ' has-error' : ''}`}>
                  <label htmlFor="regEmail">Email</label>
                  <input
                    type="email"
                    id="regEmail"
                    placeholder="you@community.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="err">Please enter a valid email address</div>
                </div>
                <div className={`field${errors.phone ? ' has-error' : ''}`}>
                  <label htmlFor="regPhone">Phone number</label>
                  <input
                    type="text"
                    id="regPhone"
                    placeholder="9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                  <div className="err">Phone Number must be exactly 10 digits long</div>
                </div>
                <div className="step-actions">
                  <button type="button" className="btn btn-primary btn-block" onClick={goNext}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="reg-step active">
                <div className="field">
                  <label>Choose your role</label>
                  <div className="role-grid">
                    {roleOptions.map((r) => (
                      <div
                        key={r.key}
                        className={`role-opt${role === r.key ? ' selected' : ''}`}
                        onClick={() => setRole(r.key)}
                      >
                        <div className="r-emoji">{r.emoji}</div>
                        <div className="r-name">{r.key}</div>
                        <div className="r-desc">{r.desc}</div>
                      </div>
                    ))}
                  </div>
                  <p className="hint" style={{ marginTop: 10 }}>
                    Operational roles require supervisor approval before activation.
                  </p>
                </div>
                <div className="step-actions">
                  <button type="button" className="btn btn-subtle" onClick={goBack}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary btn-block" onClick={goNext}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="reg-step active">
                <div className={`field${errors.password ? ' has-error' : ''}`}>
                  <label htmlFor="regPw">Password</label>
                  <div className="input-wrap">
                    <input
                      type={showPw ? 'text' : 'password'}
                      id="regPw"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => !s)}>
                      {showPw ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  <div className="pw-strength">
                    {[0, 1, 2, 3].map((i) => (
                      <i key={i} className={i < pwScore ? 'on' : ''} />
                    ))}
                  </div>
                  <div className="hint">
                    Minimum 8 characters with uppercase, lowercase, digit &amp; special character
                  </div>
                </div>
                <div className="step-actions">
                  <button type="button" className="btn btn-subtle" onClick={goBack}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary btn-block">
                    Register
                  </button>
                </div>
              </div>
            )}
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function passwordScore(v) {
  const checks = [/.{8,}/, /[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z0-9]/];
  return Math.min(4, checks.filter((r) => r.test(v)).length);
}

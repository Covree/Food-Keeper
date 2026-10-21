import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import "./AuthPages.css";

export function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err?.message || "E-mail ou senha inválidos.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <span className="auth-card__brand-mark">FK</span>
          <span className="auth-card__brand-name">Food Keeper</span>
        </div>
        <h1 className="auth-card__title">Entrar</h1>
        <p className="auth-card__subtitle">Acesse o controle de estoque e validade dos alimentos.</p>

        {error && <div className="auth-card__error">{error}</div>}

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" loading={loading} fullWidth>
            Entrar
          </Button>
        </form>

        <p className="auth-card__footer">
          Ainda não tem uma conta? <Link to="/registro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

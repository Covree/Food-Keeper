import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import "./AuthPages.css";

export function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    try {
      await register(form.name, form.email, form.password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.message || "Não foi possível criar a conta.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <span className="auth-card__brand-mark">FK</span>
          <span className="auth-card__brand-name">Food Keeper</span>
        </div>
        <h1 className="auth-card__title">Criar conta</h1>
        <p className="auth-card__subtitle">Cadastre-se para gerenciar o estoque da sua cozinha.</p>

        {error && <div className="auth-card__error">{error}</div>}
        {success && <div className="auth-card__success">Conta criada! Redirecionando para o login...</div>}

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <Input label="Nome" name="name" value={form.name} onChange={handleChange} required />
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
            autoComplete="new-password"
            minLength={8}
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" loading={loading} fullWidth>
            Criar conta
          </Button>
        </form>

        <p className="auth-card__footer">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

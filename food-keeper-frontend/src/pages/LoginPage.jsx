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
  const [showPassword, setShowPassword] = useState(false);

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
      <section className="auth-showcase" aria-label="Apresentação do Food Keeper">
        <div className="auth-showcase__top"><span className="auth-showcase__logo">✳</span><span>foodkeeper<span className="auth-showcase__dot">.</span></span></div>
        <div className="auth-showcase__content"><span className="auth-showcase__tag">✦ INTELIGÊNCIA PARA SEU ESTOQUE</span>
          <h2>Alimentos frescos.<br/><em>Gestão mais leve.</em></h2>
          <p>Controle seus produtos, acompanhe vencimentos e tome decisões melhores em um só lugar.</p>
          <div className="auth-visual" aria-hidden="true"><div className="auth-visual__top"><span>✳ Visão geral</span><span className="auth-visual__pill">● Em tempo real</span></div><div className="auth-visual__grid"><div className="auth-visual__metric"><small>Organização</small><strong>100%</strong><span>Mais clareza, menos desperdício</span></div><div className="auth-visual__donut"><span>✓</span></div></div><div className="auth-visual__bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="auth-visual__bottom"><span>Estoque sob controle</span><span>↗</span></div></div>
        </div><div className="auth-showcase__footer">FEITO PARA UMA ROTINA MAIS INTELIGENTE <span>✦</span></div>
      </section>
      <main className="auth-main"><div className="auth-main__mobile-brand">✳ foodkeeper.</div><div className="auth-card">
        <div className="auth-card__brand">
          <span className="auth-card__brand-mark">✳</span>
          <span className="auth-card__brand-name">Food Keeper</span>
        </div>
        <span className="auth-card__eyebrow">BEM-VINDO DE VOLTA 👋</span>
        <h1 className="auth-card__title">Bom ter você aqui.</h1>
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
          <div className="auth-password"><Input
            label="Senha"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            required
          /><button className="auth-password__toggle" type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? "Ocultar" : "Mostrar"}</button></div>
          <Button type="submit" loading={loading} fullWidth>
            Entrar
          </Button>
        </form>

        <p className="auth-card__footer">
          Ainda não tem uma conta? <Link to="/registro">Cadastre-se</Link>
        </p>
        <div className="auth-card__security">♢ Seus dados protegidos, sua gestão simplificada.</div>
      </div></main>
    </div>
  );
}

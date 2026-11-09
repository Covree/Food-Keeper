import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Ajuste o caminho de importação se o seu hook estiver em outro local
import "./Sidebar.css";

const NAV_ITEMS = [
  { icon: "▦", to: "/", label: "Painel", end: true, roles: ["ADMIN", "GESTOR", "FUNCIONARIO"] },
  { icon: "◈", to: "/produtos", label: "Produtos", roles: ["ADMIN", "GESTOR"] },
  { icon: "▤", to: "/categorias", label: "Categorias", roles: ["ADMIN", "GESTOR"] },
  { icon: "◷", to: "/lotes", label: "Lotes e validade", roles: ["ADMIN", "GESTOR", "FUNCIONARIO"] },
  { icon: "⇄", to: "/movimentacoes", label: "Movimentações", roles: ["ADMIN", "GESTOR", "FUNCIONARIO"] },
  { icon: "♧", to: "/alertas", label: "Alertas", roles: ["ADMIN", "GESTOR"] },
  { icon: "♙", to: "/usuarios", label: "Gestão de Usuários", roles: ["ADMIN"] },
];

export function Sidebar() {
  const { user } = useAuth();

  // Filtra apenas os itens permitidos para a role do usuário logado
  const visibleNavItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark"><img src="/images/foodkeeper-icon.png" alt="" /></span>
        <span className="sidebar__brand-name">Food Keeper</span>
      </div>
      <nav>
        <ul className="sidebar__nav">
          {visibleNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                }
              >
                <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>{item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 
import { useAuth } from "../../hooks/useAuth";
import { ROLE } from "../../utils/constants";
import "./Topbar.css";
import { UserAvatar } from "./UserAvatar";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar__spacer" />
      <div className="topbar__user">
        <UserAvatar user={user} />
        <div className="topbar__user-info">
          <span className="topbar__user-name">{user?.name}</span>
          <span className="topbar__user-role">{ROLE[user?.role]?.label || user?.role}</span>
        </div>
        <button className="topbar__logout" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}

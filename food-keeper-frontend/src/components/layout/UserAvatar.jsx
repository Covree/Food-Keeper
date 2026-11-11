import "./UserAvatar.css";

export function UserAvatar({ user, size = 42 }) {
  const name = user?.name || user?.nome || user?.fullName || "Usuário";
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const photo = user?.avatarUrl || user?.photoURL || user?.foto || user?.imageUrl;
  return (
    <span className="user-avatar" style={{ "--avatar-size": `${size}px` }} title={name} aria-label={`Perfil de ${name}`}>
      {photo ? <img src={photo} alt="" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.parentElement.dataset.fallback = initials; }} /> : initials}
    </span>
  );
}

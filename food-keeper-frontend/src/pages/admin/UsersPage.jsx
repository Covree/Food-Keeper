// src/pages/admin/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import { userAdminService } from '../../services/userAdminService';
import { PageHeader } from '../../components/common/PageHeader';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userAdminService.getAllUsers();
      
      // Trata tanto respostas em Array simples como respostas paginadas do Spring (data.content)
      const userList = Array.isArray(data) ? data : (data?.content || []);
      setUsers(userList);
    } catch (err) {
      console.error('Erro ao carregar utilizadores:', err);
      setError('Não foi possível carregar a lista de utilizadores. Verifique a ligação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAdminService.changeUserRole(userId, newRole);
      setMessage('Cargo atualizado com sucesso!');
      
      // Atualização de estado funcional e segura
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Erro ao alterar o cargo do utilizador.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>A carregar utilizadores...</div>;

  return (
    <div className="users-page" style={{ padding: '20px' }}>
      <PageHeader title="Gestão de Utilizadores e Cargos" />

      {/* Alerta de Sucesso */}
      {message && (
        <div className="alert-success" style={{ color: '#234e52', backgroundColor: '#e6fffa', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {message}
        </div>
      )}

      {/* Alerta de Erro */}
      {error && (
        <div className="alert-error" style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ccc', height: '40px' }}>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Cargo Atual</th>
            <th>Ações / Alterar Cargo</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Nenhum utilizador encontrado.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #eee', height: '50px' }}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <strong>{u.role}</strong>
                </td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '4px' }}
                  >
                    <option value="FUNCIONARIO">FUNCIONARIO</option>
                    <option value="GESTOR">GESTOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
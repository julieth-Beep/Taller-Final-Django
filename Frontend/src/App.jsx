import { useState } from 'react';
import Explorador from './features/explorador/Explorador';
import Dashboard from './features/dashboard/Dashboard';
import Login from './features/auth/Login';

export default function App() {
  const [vista, setVista] = useState('explorador');

  return (
    <div>
      <nav style={{ padding: '10px', backgroundColor: '#333', color: 'white', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button onClick={() => setVista('explorador')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>Explorador</button>
        <button onClick={() => setVista('dashboard')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>Dashboard</button>
        <button onClick={() => setVista('login')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>Login</button>
      </nav>

      <main>
        {vista === 'explorador' && <Explorador />}
        {vista === 'dashboard' && <Dashboard />}
        {vista === 'login' && <Login />}
      </main>
    </div>
  );
}
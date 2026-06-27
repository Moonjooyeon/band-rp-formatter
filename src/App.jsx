import { useState, useEffect } from 'react';
import LibraryView from './components/LibraryView.jsx';
import AddSession from './components/AddSession.jsx';
import DetailView from './components/DetailView.jsx';
import { loadLibrary, addSession, removeSession } from './lib/library.js';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [view, setView] = useState('library'); // library | add | detail
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    setSessions(loadLibrary());
  }, []);

  function handleAdd(newSession) {
    const next = addSession(newSession);
    setSessions(next);
    setView('library');
  }

  function handleDelete(session) {
    if (!confirm(`"${session.title}" 세션을 삭제할까요?`)) return;
    setSessions(removeSession(session.id));
  }

  function handleOpen(session) {
    setActiveSession(session);
    setView('detail');
  }

  // 디테일 뷰는 자체 배경을 가지므로 별도 처리
  if (view === 'detail' && activeSession) {
    return <DetailView session={activeSession} onBack={() => setView('library')} />;
  }

  return (
    <>
      <div className="glitter-overlay" />
      <div className="relative z-10 min-h-screen">
        {view === 'library' && (
          <LibraryView
            sessions={sessions}
            onOpenSession={handleOpen}
            onAddNew={() => setView('add')}
            onDelete={handleDelete}
          />
        )}
        {view === 'add' && (
          <AddSession
            onCancel={() => setView('library')}
            onSave={handleAdd}
          />
        )}
      </div>
    </>
  );
}

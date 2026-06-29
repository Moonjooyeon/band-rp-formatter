import { useState, useEffect } from 'react';
import LibraryView from './components/LibraryView.jsx';
import AddSession from './components/AddSession.jsx';
import DetailView from './components/DetailView.jsx';
import CharacterDetailView from './components/CharacterDetailView.jsx';
import { loadLibrary, addSession, removeSession } from './lib/library.js';
import { parseBackup } from './lib/parser.js';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [view, setView] = useState('library');
  const [activeSession, setActiveSession] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [incomingData, setIncomingData] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setSessions(loadLibrary());
  }, []);

  // 확장 → 웹앱 postMessage 수신
  useEffect(() => {
    function onMsg(ev) {
      if (ev.data?.type === 'BAND_RP_BACKUP_DATA') {
        try {
          const parsed = parseBackup(ev.data.payload);
          setIncomingData(parsed);
          setView('add');
          showToast('✨ 확장에서 데이터를 받았어요!');
        } catch (e) {
          showToast('❌ 데이터 형식 오류: ' + e.message);
        }
      }
    }
    window.addEventListener('message', onMsg);

    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'BAND_RP_FORMATTER_READY' }, '*');
      } catch (e) {}
    }

    return () => window.removeEventListener('message', onMsg);
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  function handleAdd(newSession) {
    const next = addSession(newSession);
    setSessions(next);
    setIncomingData(null);
    setView('library');
    showToast(`✅ "${newSession.title}" 저장됨`);
  }

  function handleCancelAdd() {
    setIncomingData(null);
    setView('library');
  }

  function handleDelete(session) {
    if (!confirm(`"${session.title}" 세션을 삭제할까요?`)) return;
    setSessions(removeSession(session.id));
  }

  function handleOpenSession(session) {
    setActiveSession(session);
    setView('detail');
  }

  function handleOpenCharacter(character) {
    setActiveCharacter(character);
    setView('character-detail');
  }

  // 디테일 뷰는 자체 흰 배경
  if (view === 'detail' && activeSession) {
    return (
      <>
        <DetailView session={activeSession} onBack={() => setView('library')} />
        {toast && <Toast>{toast}</Toast>}
      </>
    );
  }

  return (
    <>
      <div className="glitter-overlay" />
      <div className="relative z-10 min-h-screen">
        {view === 'library' && (
          <LibraryView
            sessions={sessions}
            onOpenSession={handleOpenSession}
            onOpenCharacter={handleOpenCharacter}
            onAddNew={() => setView('add')}
            onDelete={handleDelete}
          />
        )}
        {view === 'character-detail' && activeCharacter && (
          <CharacterDetailView
            character={activeCharacter}
            onBack={() => setView('library')}
            onOpenSession={handleOpenSession}
            onDeleteSession={handleDelete}
          />
        )}
        {view === 'add' && (
          <AddSession
            initialData={incomingData}
            onCancel={handleCancelAdd}
            onSave={handleAdd}
          />
        )}
      </div>
      {toast && <Toast>{toast}</Toast>}
    </>
  );
}

function Toast({ children }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-white px-5 py-3 rounded-full shadow-card-hover text-sm font-medium animate-fade-in">
      {children}
    </div>
  );
}

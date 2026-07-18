import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function LinkItem({ link, isFirst, isLast, onUpdate, onDelete, onMove }) {
  const [editing, setEditing]   = useState(false);
  const [title, setTitle]       = useState(link.title);
  const [url, setUrl]           = useState(link.url);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await api.put(`/api/links/${link._id}`, { title, url });
      onUpdate(res.data);
      setEditing(false);
    } catch {
      setTitle(link.title);
      setUrl(link.url);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setTitle(link.title);
    setUrl(link.url);
    setEditing(false);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/api/links/${link._id}`);
      onDelete(link._id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="link-item">
      {editing ? (
        <div className="link-item-edit-form">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <input value={url}   onChange={e => setUrl(e.target.value)}   placeholder="URL" />
          <div className="link-item-edit-actions">
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="link-item-view">
          <div className="link-item-info">
            <div className="link-item-title">{link.title}</div>
            <div className="link-item-url">{link.url}</div>
          </div>
          <div className="link-item-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => onMove(-1)} disabled={isFirst} title="Move up">↑</button>
            <button className="btn btn-secondary btn-sm" onClick={() => onMove(1)}  disabled={isLast}  title="Move down">↓</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn btn-danger btn-sm"    onClick={handleDelete} disabled={deleting}>
              {deleting ? '...' : 'Del'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, updateUser, logout } = useAuth();
  const [links, setLinks]   = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl]     = useState('');
  const [adding, setAdding]     = useState(false);

  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText]       = useState('');
  const [savingBio, setSavingBio]   = useState(false);
  const [copied, setCopied]         = useState(false);

  function handleCopy() {
    const url = `${window.location.origin}/u/${user?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    Promise.all([api.get('/api/auth/me'), api.get('/api/links')])
      .then(([meRes, linksRes]) => {
        updateUser(meRes.data);
        setBioText(meRes.data.bio || '');
        setLinks(linksRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [updateUser]);

  async function handleAddLink(e) {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await api.post('/api/links', { title: newTitle, url: newUrl, order: links.length });
      setLinks(prev => [...prev, res.data]);
      setNewTitle('');
      setNewUrl('');
    } finally {
      setAdding(false);
    }
  }

  function handleUpdateLink(updated) {
    setLinks(prev => prev.map(l => l._id === updated._id ? updated : l));
  }

  function handleDeleteLink(id) {
    setLinks(prev => prev.filter(l => l._id !== id).map((l, i) => ({ ...l, order: i })));
  }

  function handleMove(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;

    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((l, i) => ({ ...l, order: i }));
    setLinks(reordered); // optimistic update — UI moves immediately

    // background sync, no await
    api.put(`/api/links/${reordered[index]._id}`,  { order: reordered[index].order }).catch(console.error);
    api.put(`/api/links/${reordered[target]._id}`, { order: reordered[target].order }).catch(console.error);
  }

  async function handleSaveBio() {
    setSavingBio(true);
    try {
      const res = await api.put('/api/auth/me', { bio: bioText });
      updateUser({ bio: res.data.bio });
      setEditingBio(false);
    } finally {
      setSavingBio(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="skeleton" style={{ width: '40%', height: '36px', marginBottom: '32px' }} />
        <div className="skeleton" style={{ height: '80px', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '100px', marginBottom: '24px' }} />
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: '64px', marginBottom: '12px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn btn-secondary btn-sm" onClick={logout}>Log out</button>
      </div>

      <div className="share-banner">
        <span className="share-label">Your link</span>
        <a
          href={`/u/${user?.username}`}
          target="_blank"
          rel="noreferrer"
          className="share-url"
        >
          {window.location.origin}/u/{user?.username}
        </a>
        <button className="btn btn-primary btn-sm" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="card section-card">
        <h2 className="section-label">Bio</h2>
        {editingBio ? (
          <div className="bio-edit-row">
            <textarea
              value={bioText}
              onChange={e => setBioText(e.target.value)}
              placeholder="Tell people a bit about yourself..."
            />
            <div className="bio-buttons">
              <button className="btn btn-primary btn-sm" onClick={handleSaveBio} disabled={savingBio}>
                {savingBio ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setBioText(user?.bio || ''); setEditingBio(false); }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bio-display-row">
            <p className="bio-display">
              {user?.bio || <em className="placeholder-text">No bio yet</em>}
            </p>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditingBio(true)}>Edit</button>
          </div>
        )}
      </div>

      <div className="card section-card">
        <h2 className="section-label">Add Link</h2>
        <form onSubmit={handleAddLink} className="add-link-form">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Title  (e.g. My Portfolio)"
            required
          />
          <input
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="URL  (e.g. https://example.com)"
            type="url"
            required
          />
          <button className="btn btn-primary" type="submit" disabled={adding}>
            {adding ? 'Adding...' : 'Add link'}
          </button>
        </form>
      </div>

      <div className="links-section">
        <h2 className="section-label">Your Links</h2>
        {links.length === 0 ? (
          <p className="placeholder-text">No links yet. Add one above.</p>
        ) : (
          links.map((link, index) => (
            <LinkItem
              key={link._id}
              link={link}
              isFirst={index === 0}
              isLast={index === links.length - 1}
              onUpdate={handleUpdateLink}
              onDelete={handleDeleteLink}
              onMove={(dir) => handleMove(index, dir)}
            />
          ))
        )}
      </div>
    </div>
  );
}

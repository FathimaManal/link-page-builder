import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicApi } from '../api/axios';

export default function PublicPage() {
  const { username }              = useParams();
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);

  useEffect(() => {
    publicApi.get(`/api/public/${username}`)
      .then(res => setProfile(res.data))
      .catch(err => { if (err.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="public-page">
        <div className="public-profile">
          <div className="skeleton" style={{ width: '55%', height: '42px', marginBottom: '14px' }} />
          <div className="skeleton" style={{ width: '80%', height: '18px', marginBottom: '36px' }} />
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '56px', marginBottom: '12px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="public-page">
        <div className="public-profile">
          <h1 className="public-username">@{username}</h1>
          <p className="public-bio">This page does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-page">
      <div className="public-profile">
        <h1 className="public-username">@{profile.username}</h1>
        {profile.bio && <p className="public-bio">{profile.bio}</p>}
        <div>
          {profile.links.map(link => (
            <a
              key={link._id}
              href={link.url}
              className="public-link-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

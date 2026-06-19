import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function ApodCard() {
  const [data, setData] = useState(null);
  const [err, setErr]   = useState(null);

  useEffect(() => {
    api.apod()
      .then(setData)
      .catch(e => setErr(e.message));
  }, []);

  if (err) return (
    <div className="apod-frame reveal">
      <div className="apod-overlay">
        <div className="apod-bottom">
          <h3 className="apod-title">Unable to reach NASA</h3>
          <p className="apod-explanation">{err}</p>
        </div>
      </div>
    </div>
  );
  if (!data) return (
    <div className="apod-frame reveal">
      <div className="apod-overlay">
        <div className="apod-top"><div className="apod-date">retrieving</div></div>
        <div className="apod-bottom">
          <h3 className="apod-title">Awaiting transmission…</h3>
          <p className="apod-explanation">Connecting to NASA's astronomy archive.</p>
        </div>
      </div>
    </div>
  );

  const dateStr = data.date
    ? new Date(data.date).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="apod-frame reveal">
      {data.media_type === 'image' && data.url && (
        <div
          className="apod-media-bg"
          style={{ backgroundImage: `url(${data.hdurl || data.url})` }}
        />
      )}
      {data.media_type === 'video' && data.url && (
        <iframe
          className="apod-video"
          src={data.url}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={data.title}
        />
      )}
      <div className="apod-overlay">
        <div className="apod-top">
          <div className="apod-date">{dateStr}</div>
          <div className="apod-frame-id">NASA / APOD<br/>frame 001</div>
        </div>
        <div className="apod-bottom">
          <h3 className="apod-title">{data.title}</h3>
          <p className="apod-explanation">{data.explanation}</p>
          {data.copyright && <div className="apod-credit">© {data.copyright}</div>}
        </div>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Kind = 'thought' | 'photo';
type Place = {location:string; coordinates:[number,number]};
export default function ContentEditor({places}: {places:Place[]}) {
  const [kind, setKind] = useState<Kind>('thought');
  return <section className="studio-editor">
    <div className="studio-tabs" aria-label="Content type">
      {(['thought','photo'] as const).map(type => <button type="button" key={type} aria-pressed={kind===type} onClick={() => setKind(type)}>{type==='thought'?'Write a thought':'Add a photo'}</button>)}
    </div>
    {(['thought','photo'] as const).map(type => <div key={type} hidden={kind!==type}><Editor places={places} kind={type} /></div>)}
  </section>;
}
function Editor({places,kind}: {places:Place[];kind:Kind}) {
  const [place, setPlace] = useState('');
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(''); setResult('');
    try {
      const response = await fetch(`/api/studio/${kind}`, { method: 'POST', body: new FormData(event.currentTarget) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save. Your content is still here.');
      setMessage(data.message); setResult(data.url || '');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save. Please try again.'); }
    finally { setBusy(false); }
  }
  return <form ref={form} onSubmit={save} onChange={() => { setResult(''); setMessage(''); }} className="studio-grid">
      <fieldset className="studio-fields" disabled={busy}>
        <label>Title<input name="title" required maxLength={120} value={title} onChange={e=>setTitle(e.target.value)} placeholder={kind==='thought'?'What’s on your mind?':'A name for this moment'} /></label>
        {kind==='thought' ? <>
          <label>Short introduction<input name="cover" required maxLength={300} placeholder="One sentence for the thoughts list" /></label>
          <label>Date<input name="date" type="date" required defaultValue={new Date().toLocaleDateString('en-CA')} /></label>
          <label>Your thought<textarea name="body" required rows={14} maxLength={50000} value={body} onChange={e=>setBody(e.target.value)} placeholder="Start writing…" /></label>
          <p className="studio-hint">Markdown works here: **bold**, *italic*, headings, and links.</p>
        </> : <>
          <label className="studio-upload">Choose a photo<input name="image" type="file" accept="image/jpeg,image/png,image/webp" required onChange={e=>{ const file=e.target.files?.[0]; setPreview(file ? URL.createObjectURL(file) : ''); }} /><span>JPEG, PNG, or WebP · up to 20 MB</span></label>
          <label>Place<select value={place} onChange={e=>setPlace(e.target.value)}><option value="">New location…</option>{places.map(p=><option key={p.location} value={p.location}>{p.location}</option>)}</select></label>
          {place ? <><input type="hidden" name="location" value={place} /><input type="hidden" name="latitude" value={places.find(p=>p.location===place)!.coordinates[1]} /><input type="hidden" name="longitude" value={places.find(p=>p.location===place)!.coordinates[0]} /></> : <label>Location name<input name="location" required maxLength={120} placeholder="Yosemite, California" /></label>}
          <label>Category<select name="category" defaultValue="nature"><option value="nature">Nature</option><option value="coast">Coast</option><option value="city">City</option><option value="night">Night</option></select></label>
          {!place && <div className="studio-coordinates"><label>Latitude<input name="latitude" type="number" step="any" min="-90" max="90" required placeholder="37.7128" /></label><label>Longitude<input name="longitude" type="number" step="any" min="-180" max="180" required placeholder="-119.6053" /></label></div>}
          <p className="studio-hint">Use an approximate public location for the map, rather than a private address.</p>
        </>}
        <button className="studio-save" type="submit" disabled={busy || Boolean(result)}>{busy?'Saving…':result?'Saved':'Save locally'}</button>
        <p role="status">{message} {result && <a className="body-link" href={result}>View on site ↗</a>}</p>
      </fieldset>
      <aside className="studio-preview"><p className="eyebrow">{kind==='thought' ? 'Draft text' : 'Photo preview'}</p>{kind==='photo' ? preview ? <Image src={preview} alt={title || 'Selected photo preview'} width={800} height={1000} unoptimized /> : <div className="studio-placeholder">Your photo will appear here.</div> : <><h2>{title || 'Your next thought'}</h2><p className="studio-draft">{body || 'A quiet place to write.'}</p></>}<p>{kind==='photo' && title}</p></aside>
    </form>;
}

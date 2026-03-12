import { useRef, useState } from 'react';

export default function ImageUpload({ files, setFiles, maxFiles = 5 }) {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);

  const addFiles = (newFiles) => {
    const combined = [...files, ...Array.from(newFiles)].slice(0, maxFiles);
    setFiles(combined);
  };

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        className={`upload-area ${drag ? 'drag' : ''}`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
        <p style={{ color: '#555', fontSize: '0.9rem' }}>
          Click or drag images here
          <br />
          <small style={{ color: '#aaa' }}>Max {maxFiles} images • JPG, PNG, WEBP • Max 5MB each</small>
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <div className="upload-previews">
          {files.map((f, i) => (
            <div key={i} className="upload-preview">
              <img src={URL.createObjectURL(f)} alt={`preview-${i}`} />
              <button className="upload-preview-rm" onClick={() => removeFile(i)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

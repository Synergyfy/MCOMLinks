import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link } from '@mcom/common'

function App() {
  const [count, setCount] = useState(0)
  const [link, setLink] = useState<Link | null>(null)

  useEffect(() => {
    // Mocking an API call that returns a Link
    const newLink = new Link();
    newLink.id = '1';
    newLink.url = 'https://mcom.com';
    newLink.title = 'Mcom Links Shared Link';
    newLink.createdAt = new Date();
    setLink(newLink);
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {link && (
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3>{link.title}</h3>
          <p><a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
          <small>Created at: {link.createdAt.toLocaleString()}</small>
        </div>
      )}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

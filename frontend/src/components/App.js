import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { fetchFiles, selectStatus, selectFilter } from '../features/files/filesSlice'
import SearchBar from './SearchBar'
import FilesTable from './FilesTable'
import './App.css'

const App = () => {
  const dispatch = useDispatch()
  const status = useSelector(selectStatus)
  const filter = useSelector(selectFilter)

  useEffect(() => {
    dispatch(fetchFiles({ fileName: filter || undefined }))
  }, [dispatch, filter])

  const totalRows = useSelector((state) =>
    state.files.items.reduce((acc, f) => acc + f.lines.length, 0)
  )

  return (
    <div className="app-wrapper">
      <Navbar expand="lg" className="app-navbar" variant="dark">
        <Container fluid="xl">
          <Navbar.Brand href="#" className="app-brand">
            <img
              src="/toolbox-logo-navbar.svg"
              alt="Toolbox"
              className="brand-logo"
            />
            <span className="brand-sub">File Viewer</span>
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Item className="nav-status">
              {status === 'succeeded' && (
                <span className="status-pill status-ok">{totalRows} rows</span>
              )}
              {status === 'loading' && (
                <span className="status-pill status-loading">Loading…</span>
              )}
              {status === 'failed' && (
                <span className="status-pill status-error">Error</span>
              )}
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>

      <main className="app-main">
        <Container fluid="xl">
          <div className="page-header">
            <div className="page-header-text">
              <h1 className="page-title">File Records</h1>
              <p className="page-subtitle">
                Browse and filter CSV records fetched from the remote API
              </p>
            </div>
            <SearchBar />
          </div>

          <FilesTable />
        </Container>
      </main>

      <footer className="app-footer">
        <Container fluid="xl">
          <span>Toolbox Challenge — {new Date().getFullYear()}</span>
        </Container>
      </footer>
    </div>
  )
}

export default App

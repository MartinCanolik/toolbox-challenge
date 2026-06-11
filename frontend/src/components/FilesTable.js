import React from 'react'
import { useSelector } from 'react-redux'
import { Table, Spinner, Alert } from 'react-bootstrap'
import {
  selectFiles,
  selectStatus,
  selectError
} from '../features/files/filesSlice'
import './FilesTable.css'

const COLUMNS = [
  { key: 'file',   label: 'File Name', className: 'col-file' },
  { key: 'text',   label: 'Text',      className: 'col-text' },
  { key: 'number', label: 'Number',    className: 'col-number' },
  { key: 'hex',    label: 'Hex',       className: 'col-hex' }
]

const renderCell = (col, row) => {
  switch (col.key) {
    case 'file':
      return <span className="file-chip">{row.file}</span>
    case 'number':
      return <span className="number-badge">{row.number.toLocaleString()}</span>
    case 'hex':
      return <code className="hex-value">{row.hex}</code>
    default:
      return row[col.key]
  }
}

const FilesTable = () => {
  const files = useSelector(selectFiles)
  const status = useSelector(selectStatus)
  const error = useSelector(selectError)

  if (status === 'idle') return null

  if (status === 'loading') {
    return (
      <div className="table-state">
        <Spinner animation="border" className="state-spinner" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
        <p className="state-text">Fetching files…</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <Alert variant="danger" className="table-alert">
        <Alert.Heading>Failed to load data</Alert.Heading>
        <p className="mb-0">{error || 'An unexpected error occurred.'}</p>
      </Alert>
    )
  }

  const rows = files.flatMap((f) =>
    f.lines.map((line, i) => ({
      key: `${f.file}-${i}`,
      file: f.file,
      ...line
    }))
  )

  if (rows.length === 0) {
    return (
      <div className="table-state">
        <span className="state-empty-icon">◌</span>
        <p className="state-text">No records found</p>
      </div>
    )
  }

  return (
    <div className="table-card">
      <div className="table-card-header">
        <span className="table-count">
          {rows.length} record{rows.length !== 1 ? 's' : ''} from {files.length} file{files.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="table-scroll">
        <Table className="files-table" hover>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className={col.className}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                {COLUMNS.map((col) => (
                  <td key={col.key} className={col.className}>
                    {renderCell(col, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default FilesTable

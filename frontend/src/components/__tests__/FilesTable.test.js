import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import filesReducer from '../../features/files/filesSlice'
import FilesTable from '../FilesTable'

const mockFiles = [
  {
    file: 'test1.csv',
    lines: [
      { text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' },
      { text: 'AtjW', number: 6, hex: 'd33a8ca5d36d3106219f66f939774cf5' }
    ]
  },
  {
    file: 'test3.csv',
    lines: [
      { text: 'IbZQfqjiL', number: 1, hex: 'd3dd5008746b1dd6ea0f04fe94bef06f' }
    ]
  }
]

function renderWithStore (preloadedState) {
  const store = configureStore({
    reducer: { files: filesReducer },
    preloadedState
  })
  return render(
    <Provider store={store}>
      <FilesTable />
    </Provider>
  )
}

describe('FilesTable', () => {
  it('shows loading spinner when status is loading', () => {
    renderWithStore({ files: { items: [], status: 'loading', error: null, filter: '' } })
    expect(screen.getByText(/fetching files/i)).toBeInTheDocument()
  })

  it('shows error alert when status is failed', () => {
    renderWithStore({
      files: { items: [], status: 'failed', error: 'Network Error', filter: '' }
    })
    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument()
    expect(screen.getByText(/Network Error/i)).toBeInTheDocument()
  })

  it('renders table rows from files data', () => {
    renderWithStore({
      files: { items: mockFiles, status: 'succeeded', error: null, filter: '' }
    })
    expect(screen.getByText('RgTya')).toBeInTheDocument()
    expect(screen.getByText('AtjW')).toBeInTheDocument()
    expect(screen.getByText('IbZQfqjiL')).toBeInTheDocument()
  })

  it('renders all 4 column headers', () => {
    renderWithStore({
      files: { items: mockFiles, status: 'succeeded', error: null, filter: '' }
    })
    expect(screen.getByText(/file name/i)).toBeInTheDocument()
    expect(screen.getByText(/^text$/i)).toBeInTheDocument()
    expect(screen.getByText(/^number$/i)).toBeInTheDocument()
    expect(screen.getByText(/^hex$/i)).toBeInTheDocument()
  })

  it('shows correct row count', () => {
    renderWithStore({
      files: { items: mockFiles, status: 'succeeded', error: null, filter: '' }
    })
    expect(screen.getByText(/3 records from 2 files/i)).toBeInTheDocument()
  })

  it('displays hex values in code elements', () => {
    renderWithStore({
      files: { items: mockFiles, status: 'succeeded', error: null, filter: '' }
    })
    const hexEl = screen.getByText('70ad29aacf0b690b0467fe2b2767f765')
    expect(hexEl.tagName).toBe('CODE')
  })

  it('shows empty state when no records', () => {
    renderWithStore({
      files: { items: [], status: 'succeeded', error: null, filter: '' }
    })
    expect(screen.getByText(/no records found/i)).toBeInTheDocument()
  })

  it('shows nothing when status is idle', () => {
    const { container } = renderWithStore({
      files: { items: [], status: 'idle', error: null, filter: '' }
    })
    expect(container.firstChild).toBeNull()
  })
})

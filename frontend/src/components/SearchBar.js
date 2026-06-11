import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InputGroup, Form, Button } from 'react-bootstrap'
import { setFilter, fetchFiles, selectFilter } from '../features/files/filesSlice'
import SearchIcon from './SearchIcon'
import './SearchBar.css'

function SearchBar () {
  const dispatch = useDispatch()
  const currentFilter = useSelector(selectFilter)
  const [value, setValue] = useState(currentFilter)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    dispatch(setFilter(trimmed))
    dispatch(fetchFiles({ fileName: trimmed || undefined }))
  }

  const handleClear = () => {
    setValue('')
    dispatch(setFilter(''))
    dispatch(fetchFiles({}))
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <InputGroup className="search-group">
        <InputGroup.Text className="search-icon">
          <SearchIcon />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Filter by file name…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="search-input"
          aria-label="Filter by file name"
        />
        {value && (
          <Button
            variant="outline-secondary"
            onClick={handleClear}
            className="search-clear"
            type="button"
            aria-label="Clear filter"
          >
            ✕
          </Button>
        )}
        <Button type="submit" className="search-btn">
          Search
        </Button>
      </InputGroup>
    </form>
  )
}

export default SearchBar

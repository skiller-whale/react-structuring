import React from "react"
import { connect } from 'react-redux'

import { setSearchTermAction } from './redux'

const SearchInputWithoutRedux = ({ placeholder, setSearchTerm }) => {
  const onChange = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value)
  }

  return <React.Fragment>
    <label htmlFor="searchField">Search everything in one place</label>
    <input
    className="form-control"
    type="text"
    id="searchField"
    onChange={onChange}
    placeholder={placeholder} />
  </React.Fragment>
}

const mapSearchInputDispatchToProps = (dispatch) => {
  const setSearchTerm = (term) => {
    dispatch(setSearchTermAction(term))
  }

  return { setSearchTerm }
}

const SearchInput = connect(null, mapSearchInputDispatchToProps)(SearchInputWithoutRedux)

export default SearchInput

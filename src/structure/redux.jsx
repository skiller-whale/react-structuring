import { createStore } from 'redux'

export const ACTION_TYPE_SET_TERM = "set_term"

const reducer = (state, action) => {
  switch(action.type) {
    case ACTION_TYPE_SET_TERM:
      return {...state, term: action.search_term}
      break
    default:
      return state;
  }
}

export const setSearchTermAction = (term) => {
  return {
    type: ACTION_TYPE_SET_TERM,
    search_term: term
  }
}

const initialState = { term: "London" }
export const store = createStore(reducer, initialState)

export const mapStateToPropsWithTerm = (state) => {
  const {term} = state;
  return {term}
}


import React from "react"
import { Provider } from 'react-redux'

import SearchInput from './search_input'
import { store } from './redux'
import HackerNewsPanel from './hacker_news.jsx'
import BooksPanel from './books.jsx'

const App = () => {
  return (
    <Provider store={store}>
      <div className="container">
        <h5>Edit me in src/structure/App.jsx</h5>
        <h1>Omnisearch</h1>
        <div className="form-group">
          <SearchInput placeholder="London" />
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-12">
            <HackerNewsPanel />
          </div>
          <div className="col-lg-6 col-md-12">
            <BooksPanel />
          </div>
        </div>
      </div>
    </Provider>
  )
}

export default App

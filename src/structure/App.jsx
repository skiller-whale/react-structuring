import React from "react"

import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'

// MANAGING STATE WITH REDUX
//--------------------------
const ACTION_TYPE_SET_TERM = "set_term"

const reducer = (state, action) => {
  switch(action.type) {
    case ACTION_TYPE_SET_TERM:
      return {...state, term: action.search_term}
      break
    default:
      return state;
  }
}

const setSearchTermAction = (term) => {
  return {
    type: ACTION_TYPE_SET_TERM,
    search_term: term
  }
}

const initialState = { term: "London" }
const store = createStore(reducer, initialState)

const mapStateToPropsWithTerm = (state) => {
  const {term} = state;
  return {term}
}

// GENERIC CONTAINER COMPONENTS
//-----------------------------
const Panel = ({title, children}) => {
  return <div className="panel panel-default">
    <div className="panel-heading">
      <h3 className="panel-title">{title}</h3>
    </div>
    {children}
  </div>
}

const Table = ({children}) => {
  return <table className="table table-striped">
    <tbody>
      {children}
    </tbody>
  </table>
}

const TableRow = ({data}) => {
  let cellnum = 0;

  const cells = data.map(datum => {
    cellnum++;
    return <td key={cellnum}>{datum}</td>
  })

  return <tr>
    { cells }
  </tr>
}

// PANELS
//----------------
function book_search_url(term){
  return "http://openlibrary.org/query.json?type=/type/edition&limit=10&*=&title=" + encodeURIComponent(term)
}

class JsonFetcher extends React.Component {
  constructor(props) {
    super(props)
    this.state = { json: null }
  }

  componentDidMount() {
    this.fetchData(this.props.url)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.setState({ json: null })
      this.fetchData(this.props.url)
    }
  }

  fetchData(url) {
    fetch(url)
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({ json })
      })
  }

  render() {
    return <this.props.JsonDisplay data={this.state.json} />
  }
}

const BooksDisplay = ({data}) => {
  if(!data) { return null }

  const book_rows = data.map(book => {
    const subject_list = book.subjects && book.subjects.join("; ")
    return (
      <TableRow key={book.key} data={[book.title, book.subtitle, subject_list, book.publish_date]} />
    )
  })

  return <Table>{book_rows}</Table>
}

const BooksFromProp = ({term}) => {
  const url = book_search_url(term)

  return (
    <Panel title="Books">
      <JsonFetcher JsonDisplay={BooksDisplay} url={url} />
    </Panel>
  )
}

const Books = connect(mapStateToPropsWithTerm)(BooksFromProp)

const location_search_url = (term) => {
  return "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=" +
    encodeURIComponent(term)
}

const LocationsDisplay = ({data}) => {
  if(!data) { return null }

  const location_rows = data.map(
    ({ place_id, display_name, lat, lon }) => {
      return (
        <TableRow key={place_id} data={[display_name, `${lat},${lon}`]} />
      )
    }
  )

  return (
    <Table>{location_rows}</Table>
  )
}

const LocationsFromProp = ({term}) => {
  const url = location_search_url(term)
  return (
    <Panel title="Locations">
      <JsonFetcher JsonDisplay={LocationsDisplay} url={url} />
    </Panel>
  )
}

const Locations = connect(mapStateToPropsWithTerm)(LocationsFromProp);

const hn_search_url = (term) => {
  return "http://hn.algolia.com/api/v1/search?hitsPerPage=10&query=" + encodeURIComponent(term)
}

const HackerNewsDisplay = ({data}) => {
  if (!data) { return null }

  const hn_links = data.hits.map(
    ({ objectID, author, created_at, points, title, url }) => {
      const date = new Date(created_at)
      return (
        <HackerNewsRow key={objectID} author={author} date={date} points={points} url={url} title={title} />
      )
    }
  )

  return (
    <Table>
      {hn_links}
    </Table>
  )
}

const HackerNewsRow = (props) => {
  const date = props.date.toLocaleDateString()
  const link = <a href={props.url}>{props.title}</a>
  return <TableRow data={[date, props.points, link]} />
}

const HackerNewsFromProps = ({term}) => {
  const url = hn_search_url(term)

  return <Panel title="Hacker News">
    <JsonFetcher JsonDisplay={HackerNewsDisplay} url={url} />
  </Panel>
}

const HackerNews = connect(mapStateToPropsWithTerm)(HackerNewsFromProps)

const reddit_search_url = (term) => {
  return "https://api.reddit.com/api/subreddit_autocomplete_v2.json?limit=10&include_over_18=false&query=" + encodeURIComponent(term)
}

const RedditDisplay = ({data}) => {
  if (!data) { return null }

  const reddit_links = data.data.children.map(
    ({ data: { id, title, url, created, subscribers } }) => {
      const date = new Date(1000 * created) // Convert seconds to milliseconds
      const link = <a href={"https://reddit.com" + url}>{title}</a>

      return <TableRow key={id} data={[date.toLocaleDateString(), subscribers, link]} />
    })

  return <Table>
    {reddit_links}
  </Table>
}

const RedditFromProps = ({term}) => {
  const url = "https://api.reddit.com/api/subreddit_autocomplete_v2.json?limit=10&include_over_18=false&query=" + encodeURIComponent(term)

  return (
    <Panel title="Reddit">
      <JsonFetcher JsonDisplay={RedditDisplay} url={url} />
    </Panel>
  )
}

const Reddit = connect(mapStateToPropsWithTerm)(RedditFromProps)

// SEARCH INPUT COMPONENT
//-----------------------
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

// MAIN APP
//---------
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
            <Reddit />
          </div>
          <div className="col-lg-6 col-md-12">
            <HackerNews />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-12">
            <Locations />
          </div>
          <div className="col-lg-6 col-md-12">
            <Books />
          </div>
        </div>
      </div>
    </Provider>
  )
}

export default App

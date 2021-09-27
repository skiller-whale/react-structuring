import React from "react"
import { connect } from "react-redux"

import JsonFetcher from "./json_fetcher"
import Panel from "./panel"
import { mapStateToPropsWithTerm } from "./redux"
import { TableRow, Table } from "./table"


function book_search_url(term){
  return "http://openlibrary.org/query.json?type=/type/edition&limit=10&*=&title=" + encodeURIComponent(term)
}

const BooksTable = ({data}) => {
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
      <JsonFetcher JsonDisplay={BooksTable} url={url} />
    </Panel>
  )
}

const BooksPanel = connect(mapStateToPropsWithTerm)(BooksFromProp)

export default BooksPanel

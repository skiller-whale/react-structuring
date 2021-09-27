import React from "react"
import { connect } from "react-redux"

import JsonFetcher from "./json_fetcher"
import Panel from "./panel"
import { mapStateToPropsWithTerm } from "./redux"
import { TableRow, Table } from "./table"

const hn_search_url = (term) => {
  return "http://hn.algolia.com/api/v1/search?hitsPerPage=10&query=" + encodeURIComponent(term)
}

const HackerNewsTable = ({data}) => {
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
    <JsonFetcher JsonDisplay={HackerNewsTable} url={url} />
  </Panel>
}

const HackerNewsPanel = connect(mapStateToPropsWithTerm)(HackerNewsFromProps)

export default HackerNewsPanel

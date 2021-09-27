import React from "react"

export const Table = ({children}) => {
  return <table className="table table-striped">
    <tbody>
      {children}
    </tbody>
  </table>
}

export const TableRow = ({data}) => {
  let cellnum = 0;

  const cells = data.map(datum => {
    cellnum++;
    return <td key={cellnum}>{datum}</td>
  })

  return <tr>
    { cells }
  </tr>
}

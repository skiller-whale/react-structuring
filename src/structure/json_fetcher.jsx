import React from "react"

export default class JsonFetcher extends React.Component {
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

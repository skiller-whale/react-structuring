import React from 'react'
import {Panel} from '../App'
import renderer from 'react-test-renderer'

test('Panel renders heading and children correctly', () => {
  const component = renderer.create(
    <Panel heading="A tweet">
      <span>Some content</span>
      <img src="some_image.jpg"/>
    </Panel>
  )

  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

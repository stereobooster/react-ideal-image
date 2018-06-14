import React from 'react'
import renderer from 'react-test-renderer'
import IdealImageWithDefaults from '../components/IdealImageWithDefaults/index'

describe('IdealImageWithDefaults', () => {
  it('Renders a snapshot that is good', () => {
    const comp = renderer
      .create(
        <IdealImageWithDefaults
          placeholder={{color: 'blue'}}
          srcSet={[
            {
              src: 'some-src.jpg',
              width: 3500,
            },
          ]}
          alt="doggo"
          width={3500}
          height={2095}
        />,
      )
      .toJSON()

    expect(comp).toMatchSnapshot()
  })
})

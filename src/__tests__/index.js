import React from 'react'
import IdealImage from '../components/IdealImage/index'
import renderer from 'react-test-renderer'

describe('IdealImage', () => {
  it('Renders a snapshot that is good', () => {
    const comp = renderer
      .create(
        <IdealImage
          theme={{}}
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

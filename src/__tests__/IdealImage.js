import React from 'react'
import renderer from 'react-test-renderer'
import IdealImage from '../components/IdealImage/index'

describe('IdealImage', () => {
  it('Renders a snapshot that is good', () => {
    const comp = renderer
      .create(
        <IdealImage
          icon="icon-file"
          icons={{}}
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

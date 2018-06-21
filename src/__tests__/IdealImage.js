import React from 'react'
import Waypoint from 'react-waypoint'
import renderer from 'react-test-renderer'
import IdealImage from '../components/IdealImage'
import IntersectionObserver from '../components/IntersectionObserver'

describe('IdealImage', () => {
  it('Renders a snapshot with Waypoint', () => {
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
          observer={Waypoint}
        />,
      )
      .toJSON()

    expect(comp).toMatchSnapshot()
  })

  it('Renders a snapshot with IntersectionObserver', () => {
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
          observer={IntersectionObserver}
        />,
      )
      .toJSON()

    expect(comp).toMatchSnapshot()
  })
})

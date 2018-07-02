import * as React from 'react'
import IdealImage from '../'
import icons from '../components/icons'

interface Props {}
interface State {}

export default class Application extends React.Component<Props, State> {
  render() {
    return (
      <IdealImage
        theme={{placeholder: {filter: 'blur(3px)'}}}
        srcSet={[{src: 'some-src.jpg', width: 3500}]}
        placeholder={{color: '#FFFFFF'}}
        shouldAutoDownload={() => true}
        loader="image"
        getUrl={srcType => `some-src-${srcType}.jpg`}
        getMessage={(icon, state) => `${icon} ${state}`}
        getIcon={state => state}
        threshold={3000}
        icons={icons}
        height={3500}
        width={3500}
      />
    )
  }
}

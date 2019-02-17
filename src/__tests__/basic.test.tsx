import * as React from 'react'
import IdealImage from '../../'

interface Props {}

const Application: React.SFC<Props> = () => (
  <IdealImage
    theme={{placeholder: {filter: 'blur(3px)'}}}
    srcSet={[{src: 'some-src.jpg', width: 3500}]}
    placeholder={{color: '#FFFFFF'}}
    shouldAutoDownload={() => true}
    loader="image"
    getUrl={srcType => (srcType.src ? srcType.src : '')}
    getMessage={(icon, state) => `${icon} ${state}`}
    getIcon={state => {
      if (state === 'error') return 'error'
      else return 'loading'
    }}
    threshold={3000}
    icons={{noicon: () => null}}
    height={3500}
    width={3500}
  />
)

export default Application

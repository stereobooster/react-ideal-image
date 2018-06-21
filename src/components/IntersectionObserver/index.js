import React from 'react'
import Observer from 'react-intersection-observer'
import PropTypes from 'prop-types'

const IntersectionObserver = ({onEnter, onLeave, children}) => (
  <Observer onChange={inView => (inView ? onEnter() : onLeave())}>
    {children}
  </Observer>
)

IntersectionObserver.prototype.propTypes = {
  onEnter: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default IntersectionObserver

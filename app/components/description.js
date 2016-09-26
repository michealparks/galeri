const React = require('react')
const classnames = require('classnames')

const description = ({ __html, position, shouldAnimate }) => (
  <div
    className={ classnames('description', {
      'description--left': position === 'left',
      'description--bottom': position === 'bottom',
      'no-transition': !shouldAnimate
    }) }
    dangerouslySetInnerHTML={{ __html }} />
)

module.exports = description

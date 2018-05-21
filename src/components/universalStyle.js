// https://github.com/JedWatson/classnames
// TODO: add support for [predicate, className]
export default (...stylesOrClasses) => {
  const classes = []
  let style
  for (const obj of stylesOrClasses) {
    if (obj instanceof Object) {
      Object.assign(style || (style = {}), obj)
    } else if (obj === undefined) {
      // ignore
    } else if (typeof obj === 'string') {
      classes.push(obj)
    } else {
      throw new Error(`Unexpected value ${obj}`)
    }
  }
  return {
    className: classes.length > 1 ? classes.join(' ') : classes[0],
    style,
  }
}

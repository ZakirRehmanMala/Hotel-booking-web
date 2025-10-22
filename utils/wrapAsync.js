let wrap = (fn)=> {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => res.send(err))
  }
}
module.exports = wrap;
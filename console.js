var colors = require('colors/safe')

let log = (stuff)=> {
  console.log(stuff)
}
let logData = (data)=> {
  console.log(colors.data(data))
}
let logErr = (err)=> {
  console.log(colors.error(err))
}
let logNote = (note)=> {
  console.log(colors.note('/// ' + note))
}
let logColor = (stuff, clr)=> {
  colors.setTheme({
  clr: clr
})
  console.log(colors.clr(stuff))
}

module.exports = {
  log: log,
  logData: logData,
  logErr: logErr,
  logNote: logNote,
  logColor: logColor
}
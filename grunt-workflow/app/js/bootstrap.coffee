app = require("./app.coffee")

$ ->
  window.app = new app();
  window.app.start()

const electron = require('electron')
// Module to control application life.
const { app, protocol } = electron
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

const options = require('./options');
const server = require('./server');
const debug = require('debug');

if (!options.noServer) {
  const { host, port } = options;
  server.listen(port, host);
}

if (options.debug) {
  debug.enable('*');
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
// making config available for the client
// global.config = configuration; 

function devToolsLog(s) {
  debug.log(s)
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
  }
}

// protocol.registerStandardSchemes(['todo2'])
app.setAsDefaultProtocolClient("todo2")

function createWindow () {
  // Create the browser window.
  const props = options.debug ? {} : { width: 620, height: 800, resizable: false, maximizable: false };
  mainWindow = new BrowserWindow(props);
  mainWindow.setMenu(null);
  if (options.debug) mainWindow.openDevTools();
  
  debug.log("Registering protocol todo2");
  const res = protocol.registerHttpProtocol("todo2", (req, cb) => {
    // debug.log("req.url=" + req.url);
    // const fullUrl = formFullTodoUrl(req.url)
    devToolsLog('full url to open ' + req.url)
    // mainWindow.loadURL(fullUrl)
    cb();
  }, (err) => {
    debug.log("ERROR: ", err);
  })
  debug.log("registering result=", res);


  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "public/index.html"),
    icon: './public/favicon.png',
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

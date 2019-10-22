var electron  = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var win;

function createWindow(){
    var win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration:true
        }
    });
    win.loadFile('index.html');

    win.webContents.openDevTools();

    win.on('closed',function(){win = null;});

}

app.on('ready',createWindow);

app.on('window-all-closed',function(){
    if(process.platform != 'darwin'){
        qpp.quit
    }
});

app.on('activate',function(){
    if( win === null){
        createWindow();
    }
});

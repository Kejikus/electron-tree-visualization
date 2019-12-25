import {app, BrowserWindow, Menu, dialog} from "electron";

export let win: BrowserWindow;

function createWindow() {
	win = new BrowserWindow({
		show: false,
		width: 1000,
		height: 700,
		minWidth: 1000,
		minHeight: 700,
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.loadFile('dist/index.html');

	win.once('ready-to-show', () => {
		win.show();
	});
}

// process.env.ELECTRON_ENABLE_LOGGING = true;

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

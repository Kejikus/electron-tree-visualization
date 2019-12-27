import {app, BrowserWindow, Menu, dialog} from "electron";
import {ipcMain} from 'electron';
import {readFile} from "fs";

function sendRenderer(channel: string, ...args: any) {
	win.webContents.send(channel, ...args);
}

ipcMain.on("open-file-dialog", event1 => {
	dialog.showOpenDialog(win, {
		filters: [
			{
				name: "JSON",
				extensions: ["json"]
			},
		]
	}).then(value => {
		if (value.canceled) return;

		readFile(value.filePaths[0], "utf-8", (err, data) => {
			if (err != null) return;

			sendRenderer('opened-file-content', data);
		});
	})
});

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

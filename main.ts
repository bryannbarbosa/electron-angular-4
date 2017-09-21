import { app, BrowserWindow, screen } from 'electron';
import * as electron from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const Excel = require('exceljs');
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, {
  });
}

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  });

  // and load the index.html of the app.
  win.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

ipcMain.on('startProcess', (event, args) => {
  dialog.showOpenDialog({
    filters: [
      { name: 'Planilhas do Excel', extensions: ['xlsx'] }
    ]
  }, (fileNames) => {
    if (fileNames === undefined) {
      console.log('Nenhum arquivo executado');
      return;
    }
    const workbook = new Excel.Workbook();
    workbook.xlsx.readFile(fileNames[0])
      .then(function() {
        let worksheet = workbook.getWorksheet(1);
        let arr: number[] = [70, 77, 78, 79];

        for(let i = 10; i < 50; i++) {
          arr.push(i);
        }
        let ddi = String(args.DDI);
        let ddd = String(args.DDD);

        for (let i = 1; i <= worksheet.rowCount; i++) {
          let row = worksheet.getRow(i);
          let value = String(row.getCell(1).value);
          value = value.trim();
          value = value.replace(/\s/g, '');
          value = value.replace(/[`a-zA-Z~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
          row.getCell(1).value = value;
          row.commit();
          let length = String(row.getCell(1).value).length;

          if (length == 8 && arr.indexOf(Number(value.substr(0, 2))) > -1) {
            //console.log('55' + '11' + value);
            row.getCell(1).value = ddi + ddd + value;
          }
          else if (length == 8 && arr.indexOf(Number(value.substr(0, 2))) <= -1) {
            //console.log('55' + '11' + '9' + value);
            row.getCell(1).value = ddi + ddd + '9' + value;
          }

          if (length == 9) {
            //console.log('55' + '11' + value);
            row.getCell(1).value = ddi + ddd + value;
          }

          if (length == 10 && arr.indexOf(Number(value.substr(2, 2))) > -1) {
            //console.log('55' + value);
            row.getCell(1).value = ddi + value;
          }

          else if (length == 10 && arr.indexOf(Number(value.substr(2, 2))) <= -1) {
            let sub = value.substr(0, 2) + '9' + value.substr(2);
            //console.log('55' + sub);
            row.getCell(1).value = ddi + sub;
          }

          if (length == 11) {
            // console.log('55' + value);
            row.getCell(1).value = ddi + value;
          }

          if (length == 12 && arr.indexOf(Number(value.substr(2, 2))) <= -1) {
            let sub = ddi + String(value.slice(0, -1));
            //console.log(sub);
            row.getCell(1).value = sub;
          }
          row.commit();
        }

        let arr_fixed = [];

        for(let i = 10; i < 50; i++) {
          arr_fixed.push(i);
        }

        for (let i = 1; i <= worksheet.rowCount; i++) {
          let row = worksheet.getRow(i);
          let value = String(row.getCell(1).value);
          let length = String(row.getCell(1).value).length;

          if (length <= 7 || length == 12 && arr_fixed.indexOf(Number(value.substr(4, 2))) > -1) {
            worksheet.spliceRows(i, 1);
            i = 1;
          }
        }
        dialog.showSaveDialog({
          filters: [
            { name: 'Planilhas do Excel', extensions: ['*'] }]
        }, (fileName) => {
          if (fileName === undefined) return;
          dialog.showMessageBox({ message: "Limpeza realizada com sucesso!", buttons: ["OK"] })
          return workbook.xlsx.writeFile(fileName + '_quant' + '_' + worksheet.rowCount + '.xlsx')
        });
      });
  });
});

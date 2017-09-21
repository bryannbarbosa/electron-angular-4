const electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './app-builds/sms-database-filter-win32-x64',
    outputDirectory: './release/installer',
    authors: 'Bryann Barbosa',
    exe: 'sms-database-filter.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));

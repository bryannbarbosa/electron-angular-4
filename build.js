const electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './app-builds/sms_database_filter-win32-x64',
    outputDirectory: './release/installer',
    authors: 'Bryann Barbosa',
    exe: 'sms_database_filter.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));

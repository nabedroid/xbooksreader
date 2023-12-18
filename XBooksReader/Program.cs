using Nabedroid.XBooksReader.Common;
using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader {
  internal static class Program {
    /// <summary>
    /// アプリケーションのメイン エントリ ポイントです。
    /// </summary>
    [STAThread]
    static void Main() {
      XBooksData xBooksData = new XBooksData();
      string defaultXBooksDataPath = Path.Combine(Environment.CurrentDirectory, XBooksData.DefaultFileName);
      if (File.Exists(defaultXBooksDataPath) == false) {
        xBooksData.New(defaultXBooksDataPath);
      } else {
        xBooksData.Open(defaultXBooksDataPath);
      }
      
      Application.EnableVisualStyles();
      Application.SetCompatibleTextRenderingDefault(false);
      MainForm mainForm = new MainForm();
      mainForm.XBooksData = xBooksData;
      Application.Run(mainForm);
    }
  }
}

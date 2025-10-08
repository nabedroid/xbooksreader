using SharpCompress.Archives;
using SharpCompress.Archives.SevenZip;
using SharpCompress.Archives.Tar;
using SharpCompress.Factories;
using SharpCompress.Readers;
using SharpCompress.Readers.Tar;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Text;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection.Emit;
using System.Threading;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Nabedroid.XBooksReader.Common {

  internal class Program {

    [STAThread]
    static void Main(string[] args) {
      Console.WriteLine("[Program.Main] START");
      List<string> list = new List<string> { "C:\\20.jpg", "C:\\1.jpg", "C:\\10.jpg", "C:\\2.jpg" };
      list.Sort(WindowsStringComparer.Windows);
      foreach (string x in list) {
        Console.WriteLine(x);
      }

      Console.WriteLine("[Program.Main] END");
      System.Console.ReadKey();
    }

  }

}

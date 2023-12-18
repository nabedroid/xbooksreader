using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Text;
using System.Reflection.Emit;
using System.Threading;
using System.Threading.Tasks;

namespace Nabedroid.XBooksReader.Common {

  internal class Program {

    private static Task task;

    [STAThread]
    static void Main(string[] args) {
      Console.WriteLine("[Program.Main] START");
      for (int i = 0; i < 10; i++) {
        _ = DoAsync();
      }
      Console.WriteLine("[Program.Main] END");

      System.Console.ReadKey();
    }

    static async Task DoAsync() {
      Image image = null;
      Console.WriteLine("[Program.DoAsync] START");
      image = await ImageUtil.CreateImageAsync("C:\\Users\\nabem\\Videos\\Diablo 4\\Diablo 4 Screenshot 2023.07.08 - 15.33.37.52.png");
      Console.WriteLine($"[Program.DoAsync] IMAGE SIZE = ({image.Width}, {image.Height})");
      Console.WriteLine($"[Program.DoAsync] END");
    }

  }


}

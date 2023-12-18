using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using WindowsFormsApp1.Model;

namespace WindowsFormsApp1 {
  internal static class Program {
    /// <summary>
    /// アプリケーションのメイン エントリ ポイントです。
    /// </summary>
    [STAThread]
    static void Main() {
      Application.EnableVisualStyles();
      Application.SetCompatibleTextRenderingDefault(false);

      Data data = new Data();
      data.Add(new Character { Id = "1", Name = "atoj", Description = "1st" } );
      data.Add(new Character { Id = "2", Name = "ktot", Description = "2nd" } );
      data.Add(new Character { Id = "3", Name = "utoz", Description = "3rd" } );

      Form1 form1 = new Form1();
      form1.Data = data;

      Application.Run(form1);
    }
  }
}

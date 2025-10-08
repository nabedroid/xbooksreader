using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace Nabedroid.XBooksReader.Common {

  public class WindowsStringComparer : IComparer<string> {
    public static IComparer<string> Windows { get; } = new WindowsStringComparer();

    [DllImport("shlwapi.dll", CharSet = CharSet.Unicode, ExactSpelling = true)]
    private static extern int StrCmpLogicalW(string x, string y);

    private WindowsStringComparer() {
    }

    public int Compare(string x, string y) {
      if (ReferenceEquals(x, y)) return 0;
      if (x is null) return -1;
      if (y is null) return 1;

      return StrCmpLogicalW(x, y);
    }
  }
}

using Nabedroid.XBooksReader.Common;
using System;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader {
  internal interface IMainFormControl {
    void SearchTabNodeAfterSelect(object sender, TreeViewEventArgs e);
    void SearchTabNodeHomeAfterSelect(object sender, TreeViewEventArgs e);
    void SearchTabNodeFolderAfterSelect(object sender, TreeViewEventArgs e);
    void SearchTabNodeTagAfterSelect(object sender, TreeViewEventArgs e);
    void BookClick(object sender, EventArgs e);
    void ExitMenuClick(object sender, EventArgs e);
    void OpenMenuClick(object sender, EventArgs e);
    void SaveMenuClick(object sender, EventArgs e);
    void SaveAsMenuClick(object sender, EventArgs e);
    void UpdateMenuClick(object sender, EventArgs e);
    void AddDirectoryMenuClick(object sender, EventArgs e);
    XBooksData XBooksData { get; set; }
  }
}

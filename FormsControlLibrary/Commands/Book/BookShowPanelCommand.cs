using Nabedroid.XBooksReader.Common;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  internal class BookShowPanelCommand : IBookShowPanelCommand {

    private Book _book;
    private BookShowPanel _panel;

    public BookShowPanelCommand(BookShowPanel panel) {
      _panel = panel;
    }

    public Book Book {
      get { return this._book; }
      set {
        this._book = value;
        List<string> imageFiles = this._book.GetBookImageFiles();
        this._panel.BindingSource.DataSource = imageFiles;
      }
    }

    public void Fit(object sender, EventArgs e) {
      CheckBox checkBox = sender as CheckBox;
      if (checkBox != null) {
        _panel.PictureBoxEx.Fit(checkBox.Checked);
      }
      Debug.WriteLine($"{((CheckBox)sender).Checked}");
    }

  }

}

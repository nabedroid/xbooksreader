using Nabedroid.XBooksReader.Common;
using System;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  internal interface IBookShowPanelCommand {
    Book Book { get; set; }
    void Fit(object sender, EventArgs e);
  }

}

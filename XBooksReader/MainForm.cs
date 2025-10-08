using Nabedroid.XBooksReader.Common;
using Nabedroid.XBooksReader.FormsControlLibrary;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader {
  public partial class MainForm : Form {
    private XBooksData _xBooksData;
    private IMainFormControl _control;
    private BookViewControl _bookViewControl;

    public MainForm() {
      InitializeComponent();
      this._bookViewControl = new BookViewControl();
      this.splitContainer1.Panel2.Controls.Add(this._bookViewControl);
      this._bookViewControl.Dock = DockStyle.Fill;
      this._bookViewControl.Visible = false;

      _control = new MainFormControl(this);

      this.searchTab1.TreeViewNodeHomeAfterSelect += _control.SearchTabNodeHomeAfterSelect;
      this.searchTab1.TreeViewNodeFolderAfterSelect += _control.SearchTabNodeFolderAfterSelect;
      this.searchTab1.TreeViewNodeTagAfterSelect += _control.SearchTabNodeTagAfterSelect;
      this.toolStripMenuItemOpen.Click += _control.OpenMenuClick;
      this.toolStripMenuItemSaveAs.Click += _control.SaveAsMenuClick;
      this.toolStripMenuItemSave.Click += _control.SaveMenuClick;
      this.toolStripMenuItemUpdate.Click += _control.UpdateMenuClick;
      this.toolStripMenuItemAddDirectory.Click += _control.AddDirectoryMenuClick;
      this.toolStripMenuItemExit.Click += _control.ExitMenuClick;
      this.bookListPanel1.BookButtonClick += _control.BookClick;
    }

    public void SetBooks(ObservableCollection<Book> books) {
      this.bookListPanel1.Books = books;
    }

    public void BookShowPanelVisible(bool visible) {
      _bookViewControl.Visible = visible;
      BookListPanel.Visible = !visible;
    }

    public void BookListPanelVisible(bool visible) {
      BookListPanel.Visible = visible;
      _bookViewControl.Visible = !visible;
    }

    public BookViewControl BookViewControl { get { return this._bookViewControl; } }
    public BookListControl BookListPanel { get { return this.bookListPanel1; } }

    public XBooksData XBooksData {
      get { return _xBooksData; }
      set {
        _xBooksData = value;
        _control.XBooksData = value;
        searchTab1.XBooksData = value;
      }
    }
  }
}

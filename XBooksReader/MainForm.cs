using Nabedroid.XBooksReader.Common;
using Nabedroid.XBooksReader.FormsControlLibrary;
using System.Collections.Generic;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader {
  public partial class MainForm : Form {
    private XBooksData _xBooksData;
    private IMainFormControl _control;
    private BookShowPanel _bookShowPanel;

    public MainForm() {
      InitializeComponent();
      this._bookShowPanel = new BookShowPanel();
      this.splitContainer1.Panel2.Controls.Add(this._bookShowPanel);
      this._bookShowPanel.Dock = DockStyle.Fill;
      this._bookShowPanel.Visible = false;

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
      this.bookListPanel1.BookMouseClick += _control.BookClick;
    }

    public void SetBooks(List<Book> books) {
      this.bookListPanel1.Books = books;
    }

    public void BookShowPanelVisible(bool visible) {
      _bookShowPanel.Visible = visible;
      BookListPanel.Visible = !visible;
    }

    public void BookListPanelVisible(bool visible) {
      BookListPanel.Visible = visible;
      _bookShowPanel.Visible = !visible;
    }

    public BookShowPanel BookShowPanel { get { return this._bookShowPanel; } }
    public BookListPanel BookListPanel { get { return this.bookListPanel1; } }

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

using Nabedroid.XBooksReader.Common;
using System;
using System.Diagnostics;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  public partial class SearchTabView : UserControl {

    public event TreeViewEventHandler TreeViewNodeAfterSelect;
    public event TreeViewEventHandler TreeViewNodeHomeAfterSelect;
    public event TreeViewEventHandler TreeViewNodeFolderAfterSelect;
    public event TreeViewEventHandler TreeViewNodeTagAfterSelect;

    private XBooksData _xBooksData;
    private SearchTabHomeTreeView _homeTreeView;
    private SearchTabFolderTreeView _folderTreeView;
    private SearchTabTagTreeView _tagTreeView;

    public SearchTabView() {
      InitializeComponent();
      // タブ要素作成
      this._homeTreeView = new SearchTabHomeTreeView() { Dock = DockStyle.Fill };
      this._folderTreeView = new SearchTabFolderTreeView() { Dock = DockStyle.Fill };
      this._tagTreeView = new SearchTabTagTreeView() { Dock = DockStyle.Fill };

      this._homeTreeView.TreeViewAfterSelect += this._TreeViewNodeHomeAfterSelect;
      this._folderTreeView.TreeViewAfterSelect += this._TreeViewNodeFolderAfterSelect;
      this._tagTreeView.TreeViewAfterSelect += this._TreeViewNodeTagAfterSelect;

      this.tabPageHome.Controls.Add(this._homeTreeView);
      this.tabPageFolder.Controls.Add(this._folderTreeView);
      this.tabPageTag.Controls.Add(this._tagTreeView);
    }

    private void _TreeViewNodeHomeAfterSelect(object sender, TreeViewEventArgs e) {
      this.TreeViewNodeHomeAfterSelect?.Invoke(this, e);
      this.TreeViewNodeAfterSelect?.Invoke(sender, e);
    }

    private void _TreeViewNodeFolderAfterSelect(object sender, TreeViewEventArgs e) {
      this.TreeViewNodeFolderAfterSelect?.Invoke(this, e);
      this.TreeViewNodeAfterSelect?.Invoke(sender, e);

    }

    private void _TreeViewNodeTagAfterSelect(object sender, TreeViewEventArgs e) {
      this.TreeViewNodeTagAfterSelect?.Invoke(this, e);
      this.TreeViewNodeAfterSelect?.Invoke(sender, e);
    }

    public XBooksData XBooksData {
      set {
        this._xBooksData = value;
        this._homeTreeView.ObservableDictionary = null;
        this._folderTreeView.ObservableDictionary = this._xBooksData.Books;
        this._tagTreeView.ObservableDictionary = this._xBooksData.Tags;
      }
    }

  }

}

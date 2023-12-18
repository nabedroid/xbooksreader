using Nabedroid.XBooksReader.Common;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader {
  internal class MainFormControl : IMainFormControl {
    private MainForm _mainForm;
    private XBooksData _xBooksData;

    public MainFormControl(MainForm mainForm) {
      _mainForm = mainForm;
    }

    /// <summary>
    /// メニューバーの追加クリック時の処理
    /// フォルダ選択ダイアログを表示し、設定ファイルに選択されたフォルダを追加する
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public void AddDirectoryMenuClick(object sender, EventArgs e) {
      using (FolderBrowserDialog folderBrowserDialog = new FolderBrowserDialog()) {
        folderBrowserDialog.Description = "検索対象のフォルダを選択してください。";
        //folderBrowserDialog.RootFolder = Environment.SpecialFolder.Personal;
        folderBrowserDialog.ShowNewFolderButton = true;
        if (folderBrowserDialog.ShowDialog() == DialogResult.OK) {
          _xBooksData.Add(new SearchPath { Path = folderBrowserDialog.SelectedPath });
        }
      }
    }

    /// <summary>
    /// 本選択時の処理
    /// </summary>
    public void BookClick(object sender, MouseEventArgs e) {
      Book clickBook = _mainForm.BookListPanel.ClickBook;
      if (clickBook != null) {
        _mainForm.BookShowPanelVisible(true);
        //_mainForm.BookListPanel.Visible = false;
        // BookShowPanel を表示した状態で Book を設定しないと DataBinding がうまく処理されずにエラーで落ちる
        //_mainForm.BookShowPanel.Visible = true;
        _mainForm.BookShowPanel.Book = clickBook;
      }
    }

    /// <summary>
    /// メニューバーの終了クリック時の処理
    /// フォームを閉じる
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public void ExitMenuClick(object sender, EventArgs e) {
      _mainForm.Close();
    }

    /// <summary>
    /// メニューバーの開くクリック時の処理
    /// 設定ファイル選択ダイアログで選択されたファイルを読み込む
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public void OpenMenuClick(object sender, EventArgs e) {
      using (OpenFileDialog openFileDialog = new OpenFileDialog()) {
        openFileDialog.DefaultExt = "json";
        openFileDialog.InitialDirectory = Environment.CurrentDirectory;
        openFileDialog.Multiselect = false;
        if (openFileDialog.ShowDialog() == DialogResult.OK) {
          try {
            string path = openFileDialog.FileName;
            _xBooksData.Open(path);
          } catch (Exception ex) {
            MessageBox.Show("無効なファイルです。", "エラー", MessageBoxButtons.OK, MessageBoxIcon.Error);
          }
        }
      }
    }

    /// <summary>
    /// メニューバーの保存クリック時の処理
    /// 現在の設定ファイルを上書きする
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public void SaveMenuClick(object sender, EventArgs e) {
      _xBooksData.Save();
    }

    /// <summary>
    /// メニューバーの別名保存クリック時の処理
    /// ファイル選択ダイアログで選択されたパスに設定ファイルを保存する
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public void SaveAsMenuClick(object sender, EventArgs e) {
      using (SaveFileDialog saveFileDialog = new SaveFileDialog()) {
        saveFileDialog.FileName = XBooksData.DefaultFileName;
        saveFileDialog.InitialDirectory = XBooksData.JsonPath;
        if (saveFileDialog.ShowDialog() == DialogResult.OK) {
          try {
            string path = saveFileDialog.FileName;
            _xBooksData.SaveAs(path);
          } catch (Exception ex) {
            MessageBox.Show("無効な保存先です。", "エラー", MessageBoxButtons.OK, MessageBoxIcon.Error);
          }
        }
      }
    }

    /// <summary>
    /// 検索タブのノードクリック時の処理
    /// ノードに応じた本一覧を右側のパネルに表示する
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public void SearchTabNodeAfterSelect(object sender, TreeViewEventArgs e) { }

    public void SearchTabNodeHomeAfterSelect(object sender, TreeViewEventArgs e) {
      switch (e.Node.Text) {
        case "高評価":
          break;
        case "表示回数":
          break;
        case "最近追加":
          break;
      }
    }

    public void SearchTabNodeFolderAfterSelect(object sender, TreeViewEventArgs e) {
      // TODO: 本をクリックし、TreeViewから同じフォルダを選択すると、本をクリックする前の選択状態が保持されているので、AfterSelectが発火しない
      _mainForm.BookListPanelVisible(true);
      AbstractBookFilter filter = new BookFilterPath(new BookFilterAnd(), e.Node.FullPath);
      List<Book> books = _xBooksData.SelectBook(filter);
      _mainForm.SetBooks(books);
    }

    public void SearchTabNodeTagAfterSelect(object sender, TreeViewEventArgs e) {

    }

    public void UpdateMenuClick(object sender, EventArgs e) {
      _xBooksData.Search();
      foreach (var book in _xBooksData.Books) {
        Debug.WriteLine(book);
      }
    }

    public XBooksData XBooksData {
      get { return _xBooksData; }
      set { _xBooksData = value; }
    }
  }
}

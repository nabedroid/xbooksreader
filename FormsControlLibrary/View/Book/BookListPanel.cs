using Nabedroid.XBooksReader.Common;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  public partial class BookListPanel : UserControl {
    public event MouseEventHandler BookMouseClick;
    private List<Book> _books;
    private Book _clickBook;
    private Task _task;
    private CancellationTokenSource _cts;

    public BookListPanel() {
      InitializeComponent();
    }

    private void _BookMouseClick(object sender, MouseEventArgs e) {
      this._clickBook = null;
      BookPanel bookPanel = sender as BookPanel;
      if (bookPanel != null) {
        this._clickBook = bookPanel.Book;
        this.BookMouseClick?.Invoke(this, e);
      }
    }

    /// <summary> 
    /// 使用中のリソースをすべてクリーンアップします。
    /// </summary>
    /// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
    protected async override void Dispose(bool disposing) {
      if (_task != null) {
        _cts?.Cancel();
        await _task;
        _cts?.Dispose();
        _task?.Dispose();
      }
      RemoveBookButtons();
      if (disposing && (components != null)) {
        components.Dispose();
      }
      base.Dispose(disposing);
    }

    protected void RemoveBookButtons() {
      foreach (Control control in flowLayoutPanel1.Controls) {
        BookButton button = control as BookButton;
        if (button != null) {
          button.MouseClick -= this._BookMouseClick;
          button.Dispose();
        }
      }
      flowLayoutPanel1.Controls.Clear();
    }

    /// <summary>
    /// Bookボタンを books に応じて生成する
    /// </summary>
    /// <returns></returns>
    private async Task SetBookButtonsAsync() {
      // 前のスレッドの処理終了を待つ
      if (_task != null) {
        _cts?.Cancel();
        await _task;
      }
      // 全Bookパネルを削除
      RemoveBookButtons();
      // Bookパネルを１つずつ追加する処理を別スレッドで開始する
      _cts = new CancellationTokenSource();
      _task = Task.Run(() => {
        foreach (Book book in this._books ?? new List<Book>()) {
          if (_cts.IsCancellationRequested) break;
          BookButton button = new BookButton();
          button.Book = book;
          //button.MouseClick += this._BookMouseClick;
          if (InvokeRequired) {
            Invoke(new Action(() => { this.flowLayoutPanel1.Controls.Add(button); }));
          } else {
            this.flowLayoutPanel1.Controls.Add(button);
          }
        }
        return;
      }, _cts.Token);
    }

    public Book ClickBook { get { return this._clickBook; } }

    public List<Book> Books {
      get { return this._books; }
      set {
        this._books = value;
        // ブックボタンを追加
        _ = SetBookButtonsAsync();
      }
    }
  }

}
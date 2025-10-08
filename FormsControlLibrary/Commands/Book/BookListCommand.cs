using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

using Nabedroid.XBooksReader.Common;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  /// <summary>
  /// BookListControlの制御クラス
  /// </summary>
  public class BookListControlCommand : IDisposable {

    // Synchronized 用の変数
    private AsyncLock _asyncLock = new AsyncLock();
    // タスクキャンセルソース
    private CancellationTokenSource _cts;
    // Dispose済みか表すフラグ
    private bool _disposed = false;
    // 本リスト
    private ObservableCollection<Book> _books;
    // コントロール
    private BookListControl _bookListControl;

    public BookListControlCommand(BookListControl bookListControl) {
      _bookListControl = bookListControl;
    }

    /// <summary>
    /// クラス破棄
    /// </summary>
    public async void Dispose() {
      await Dispose(true);
    }

    /// <summary>
    /// クラス破棄
    /// </summary>
    protected async virtual Task Dispose(bool disposing) {
      using (await _asyncLock.LockAsync()) {
        if (_disposed) return;
        // タスクをキャンセルし、全コントロールを削除する
        if (disposing) {
          _cts?.Cancel();
          _cts?.Dispose();
          RemoveButtons();
        }
        _disposed = true;
      }
    }

    /// <summary>
    /// 現在の本リストの状態に応じて本ボタンを追加しなおす
    /// </summary>
    /// <returns></returns>
    public async Task ResetButtons() {
      // スレッド制限
      using (await _asyncLock.LockAsync()) {
        // 実行中のリセットボタン処理をキャンセルする
        _cts?.Cancel();
        _cts?.Dispose();
        // ボタンを全て削除して追加
        RemoveButtons();
        AddButtons();
        Sort();
        // ボタンの背景読み込みを非同期で実行
        _cts = new CancellationTokenSource();
        _ = EnableBackgroundImageAsync(_cts.Token);
      }
    }

    /// <summary>
    /// コントロールからボタンを削除する
    /// </summary>
    /// <param name="button">本ボタン</param>
    public void RemoveButton(BookButton button) {
      // UIスレッドで実行する
      if (_bookListControl.InvokeRequired) {
        _bookListControl.Invoke(new Action<BookButton>(RemoveButton), button);
      } else {
        _bookListControl.ButtonControls.Remove(button);
        button.Click -= BookButtonClick;
        button.Dispose();
      }
    }

    /// <summary>
    /// 本ボタンを押した時のイベント
    /// BookListControl のイベントハンドラーに伝播させる
    /// </summary>
    /// <param name="sender">BookButton</param>
    /// <param name="e">未設定</param>
    public void BookButtonClick(object sender, EventArgs e) {
      _bookListControl.BookButtonClick?.Invoke(sender, e);
    }

    /// <summary>
    /// コントロールからボタンを全て削除する
    /// </summary>
    public void RemoveButtons() {
      int count = _bookListControl?.ButtonControls.Count ?? 0;

      for (int i = count - 1; i >= 0; i--) {
        BookButton button = (BookButton)_bookListControl.ButtonControls[i];
        RemoveButton(button);
      }
    }

    /// <summary>
    /// コントロールに本ボタンを追加する
    /// </summary>
    /// <param name="book">Book</param>
    public void AddButton(Book book) {
      if (_bookListControl.InvokeRequired) {
        _bookListControl.Invoke(new Action<Book>(AddButton), book);
      } else {
        Button button = new BookButton(book);
        button.Click += BookButtonClick;
        this._bookListControl.FlowLayoutPanelBottom.Controls.Add(button);
      }
    }

    /// <summary>
    /// コントロールに本リストに対応したボタンを複数追加する
    /// </summary>
    public void AddButtons() {
      // ボタンを配置する
      foreach (Book book in _books) {
        AddButton(book);
      }
    }

    /// <summary>
    /// 本ボタンの背景画像を非同期で読み込む
    /// </summary>
    /// <param name="token">キャンセルトークン</param>
    /// <returns>Task(void)</returns>
    public async Task EnableBackgroundImageAsync(CancellationToken token) {
      // 背景画像を表示する
      foreach (Control control in _bookListControl.FlowLayoutPanelBottom.Controls) {
        token.ThrowIfCancellationRequested();
        BookButton button = (BookButton)control;
        await button.BackgroundImageAsync(token);
      }
    }

    /// <summary>
    /// 現在のソート要素、昇降順、お気に入りの状態に応じて本ボタンをソートする
    /// </summary>
    public void Sort() {
      int count = _bookListControl.ButtonControls.Count;
      List<BookButton> controls = new List<BookButton>();
      // 本ボタンをコントロール上から一旦削除
      for (int i = count - 1; i >= 0; i--) {
        Control control = _bookListControl.ButtonControls[i];
        controls.Add((BookButton)control);
        _bookListControl.ButtonControls.Remove(control);
      }
      // 本ボタンをソート
      BookListControl.ComboBoxSortItem item = (BookListControl.ComboBoxSortItem)_bookListControl.ComboBoxSort.SelectedItem;
      BookButtonComparer comparer = item.Comparer;
      if (_bookListControl.CheckBoxDesc.Checked) {
        comparer = new BookButtonComparerDesc(comparer);
      }
      controls.Sort(comparer);
      Debug.WriteLine(_bookListControl.ComboBoxSort.SelectedItem);
      // 再度追加
      for (int i = 0; i < count; i++) {
        controls[i].Visible = _bookListControl.CheckBoxFavorite.Checked ? controls[i].Book.Favorite : true;
        _bookListControl.ButtonControls.Add(controls[i]);
      }
      controls.Clear();
      controls = null;
    }

    public ObservableCollection<Book> Books {
      set {
        _books = value ?? new ObservableCollection<Book>();
        _ = ResetButtons();
      }
    }
  }
}
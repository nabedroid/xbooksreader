using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Data;
using System.Data.OleDb;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

using Nabedroid.XBooksReader.Common;

namespace Nabedroid.XBooksReader.FormsControlLibrary {
  public partial class BookViewControl : UserControl {

    private BookViewCommand _command;

    public BookViewControl() {
      InitializeComponent();
      _command = new BookViewCommand(this);
      // ボタンのイベント登録
      _doublePrevButton.Click += OnDoublePreviousButtonClick;
      _prevButton.Click += OnPreviousButtonClick;
      _nextButton.Click += OnNextButtonClick;
      _doubleNextButton.Click += OnDoubleNextButtonClick;
      _fitCheckBox.CheckedChanged += OnFitCheckBoxChange;
      // コマンドのイベント登録
      _command.CurrentIndexChanged += OnCurrentIndexChange;
      _command.CountChanged += OnCountChange;

      Disposed += OnDispose;
    }

    public void OnDispose(object sender, EventArgs e) {
      _doublePrevButton.Click -= OnDoublePreviousButtonClick;
      _prevButton.Click -= OnPreviousButtonClick;
      _nextButton.Click -= OnNextButtonClick;
      _doubleNextButton.Click -= OnDoubleNextButtonClick;
      _command.CurrentIndexChanged -= OnCurrentIndexChange;
      _command.CountChanged -= OnCountChange;
    }

    private void OnDoublePreviousButtonClick(object sender, EventArgs e) { _command.MoveFirst(); }
    private void OnPreviousButtonClick(object sender, EventArgs e) { _command.MovePrevious(); }
    private void OnNextButtonClick(object sender, EventArgs e) { _command.MoveNext(); }
    private void OnDoubleNextButtonClick(object sender, EventArgs e) { _command.MoveLast(); }

    private void OnFitCheckBoxChange(object sender, EventArgs e) {
      _pictureBoxEx.Fit(_fitCheckBox.Checked);
    }

    /// <summary>
    /// ページ切り替え時の処理
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void OnCurrentIndexChange(object sender, PropertyChangedEventArgs e) {
      // ページ数の表示更新
      _currentPageLabel.Text = $"{_command.CurrentIndex + 1}";
      // 画像更新
      Image image = _command.CurrentImage;
      _pictureBoxEx.Image = image;
      _pictureBoxEx.Fit(_fitCheckBox.Checked);
    }

    /// <summary>
    /// ページ総数変更時の処理
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void OnCountChange(object sender, PropertyChangedEventArgs e) {
      _totalPageLabel.Text = $"{_command.Count}";
    }

    public Book Book {
      set {
        _command.Book = value;
      }
    }
  }
}

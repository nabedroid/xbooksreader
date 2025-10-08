using Nabedroid.XBooksReader.Common;
using System;
using System.Diagnostics;
using System.Drawing;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  /// <summary>
  /// 背景画像に本のサムネイルを表示するボタンクラス
  /// </summary>
  public class BookButton : Button {

    /// <summary>
    /// 本
    /// </summary>
    private Book _book;
    /// <summary>
    /// 排他制御用のオブジェクト
    /// </summary>
    private object _locker = new object();

    /// <summary>
    /// コンストラクタ
    /// </summary>
    /// <param name="book">本</param>
    public BookButton(Book book) : base() {
      InitializeComponent();
      _book = book;
      // Controls.Findで検索出来るようにNameに本IDを設定しておく
      Name = _book.Id.ToString();
    }

    /// <summary>
    /// ControlのUI設定
    /// </summary>
    private void InitializeComponent() {
      BackgroundImageLayout = ImageLayout.Zoom;
      Size = new Size(100, 150);
    }

    /// <summary>
    /// オブジェクトを破棄する
    /// </summary>
    /// <param name="disposing"></param>
    protected override void Dispose(bool disposing) {

      if (IsDisposed) return;

      if (disposing) {
        BackgroundImage?.Dispose();
      }
      base.Dispose(disposing);
    }

    /// <summary>
    /// 単一スレッドかつ更新時に既存の背景画像も削除する
    /// TODO: もし背景画像に使ったImageを使いまわしている場合はDisposeの削除を検討すること
    /// </summary>
    public override Image BackgroundImage {
      get { return base.BackgroundImage; }
      set {
        lock (_locker) {
          base.BackgroundImage?.Dispose();
          base.BackgroundImage = value;
        }
      }
    }

    /// <summary>
    /// 非同期で背景画像を設定する
    /// </summary>
    /// <returns>Task(void)</returns>
    /// TODO: 瞬間的に複数実行（Task.Runの実行前に別スレッドで更に実行）されると、先頭の画像生成/設定タスクの待機処理を追い越し、画像生成/設定タスクが複数個発生してしまう
    public Task BackgroundImageAsync(CancellationToken token) {
      return Task.Run(async () => {
        Debug.WriteLine($"[BookButton#BackgroundImageAsync@Task] START {_book.Thumbnail}");
        // サムネイルを同期で取得する
        Image image = await _book.GetBookImageFactory().GetThumbnailAsync(_book.Thumbnail, token);
        // UIスレッドで背景画像を設定する
        if (IsDisposed == false) {
          Invoke(new Action(() => { BackgroundImage = image; }));
        }
        Debug.WriteLine($"[BookButton#BackgroundImageAsync@Task] END {_book.Thumbnail}");
      }, token);
    }

    /// <summary>
    /// 本を設定する
    /// 背景画像を表示する場合はBackgroundImageAsyncを呼び出すこと
    /// </summary>
    public Book Book {
      get { return _book; }
    }

  }

}
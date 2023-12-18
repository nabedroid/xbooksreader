using Nabedroid.XBooksReader.Common;
using System;
using System.Diagnostics;
using System.Drawing;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  public partial class BookButton : Button {

    private Book _book;

    public BookButton() : base() {
      InitializeComponent();
    }

    private void InitializeComponent() {
      BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
      //Dock = System.Windows.Forms.DockStyle.Fill;
      Location = new System.Drawing.Point(0, 0);
      Size = new System.Drawing.Size(200, 282);
      UseVisualStyleBackColor = true;
    }

    /// <summary> 
    /// 使用中のリソースをすべてクリーンアップします。
    /// </summary>
    /// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
    protected override void Dispose(bool disposing) {
      base.Dispose(disposing);
    }

    // TODO: ボタンのサイズを変更できるようにする
    // ボタンのサイズのサムネイルを作成する
    private async Task BackgroundImageAsync() {
      // 以降非同期処理
      // 画像読み込み
      Image image = null;
      if (_book?.Thumbnail != null) {
        //Debug.WriteLine($"[BookButton.BackgroundImageAsync] CreateImage START {_book?.Title}");
        //image = ImageUtil.CreateImage(this._book.Thumbnail, Width, Height);
        Task task = Task.Run( () => { return null; } );
        await task;
        // image = await ImageUtil.CreateImageAsync(this._book.Thumbnail, Width, Height);
        Debug.WriteLine($"[BookButton.BackgroundImageAsync] CreateImage END {_book?.Title}");
        // image = ImageUtil.CreateImage(this._book.Thumbnail, Width, Height);
      }
      // UIスレッドに背景変更リクエスト
      if (InvokeRequired) {
        Invoke(new Action(() => {
          BackgroundImage?.Dispose();
          BackgroundImage = image;
        }));
      } else {
        BackgroundImage?.Dispose();
        BackgroundImage = image;
      }
    }

    public Book Book {
      get { return this._book; }
      set {
        this._book = value;
        _ = BackgroundImageAsync();
      }
    }

  }
}
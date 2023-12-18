using Nabedroid.XBooksReader.Common;
using System.Diagnostics;
using System.Drawing;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  public partial class BookPanel : UserControl {
    private Book _book;
    public event MouseEventHandler ButtonMouseClick;

    public BookPanel() {
      InitializeComponent();
      this.button1.MouseClick += this._ButtonMouseClick;
    }

    /// <summary> 
    /// 使用中のリソースをすべてクリーンアップします。
    /// </summary>
    /// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
    protected override void Dispose(bool disposing) {
      if (disposing && (components != null)) {
        this.button1.MouseClick -= this._ButtonMouseClick;
        this.button1.BackgroundImage?.Dispose();
        components.Dispose();
      }
      base.Dispose(disposing);
    }

    private void _ButtonMouseClick(object sender, MouseEventArgs e) {
      this.ButtonMouseClick?.Invoke(this, e);
    }

    public Book Book {
      get { return this._book; }
      set { 
        this._book = value;
        // 既存の画像を破棄
        this.button1.BackgroundImage?.Dispose();
        if (this._book != null) {
          // TODO: ボタンのサイズを変更できるようにする
          // ボタンのサイズのサムネイルを作成する
          Image image = ImageUtil.CreateImage(this._book.Thumbnail, Width, Height, 1);
          this.button1.BackgroundImage = image;
        }
      }
    }

  }
}

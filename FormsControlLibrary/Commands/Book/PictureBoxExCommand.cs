using Nabedroid.XBooksReader.Common;
using System;
using System.Drawing;
using System.Runtime.CompilerServices;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  internal class PictureBoxExCommand : IPictureBoxExCommand {

    private PictureBoxEx _pictureBoxEx;
    private PictureBox _pictureBox;
    private int _zoom = 100;
    private Point _dragPos;
    private string _path;
    private Image _image;
    private bool _fit;

    public PictureBoxExCommand(PictureBoxEx pictureBoxEx) {
      this._pictureBoxEx = pictureBoxEx;
      this._pictureBox = pictureBoxEx.PictureBox;
      this.Fit(true);
    }

    public void MouseClick(object sender, MouseEventArgs e) { }

    // マウスボタン押し込み時に座標取得
    public void MouseDown(object sender, MouseEventArgs e) {
      if (this._fit) return;
      if (e.Button == MouseButtons.Left) {
        // 左クリックした座標を保存する
        this._dragPos = new Point(e.X, e.Y);
      }
    }

    // マウスドラッグ中は画像をずらす
    public void MouseMove(object sender, MouseEventArgs e) {
      if (this._fit) return;
      // ドラッグ中以外は無視
      if (this._dragPos == Point.Empty || sender as System.Windows.Forms.Control == null) return;
      // 画像の位置をずらす
      this._pictureBox.Left = e.X + this._pictureBox.Left - this._dragPos.X;
      this._pictureBox.Top = e.Y + this._pictureBox.Top - this._dragPos.Y;
    }

    // マウスボタン解放時に座標破棄
    public void MouseUp(object sender, MouseEventArgs e) {
      if (this._fit) return;
      this._dragPos = Point.Empty;
    }

    public void MouseWheel(object sender, MouseEventArgs e) {
      if (this._fit) return;
      // ホイールした座標を等倍画像の座標に変換
      int originX = (int)(e.X / (this._zoom / 100f));
      int originY = (int)(e.Y / (this._zoom / 100f));
      // ホイールした座標から画面端までの長さを計算
      int offsetX = e.X + this._pictureBox.Left;
      int offsetY = e.Y + this._pictureBox.Top;
      // マウスホイールの方向に応じて拡大率を変える
      // 小数点の誤差の関係で拡大・縮小しても拡大率が100に戻らない事が多々ある
      if (e.Delta > 0) {
        // 10%拡大する
        this.ZoomIn();
      } else if (e.Delta < 0) {
        // 10%縮小する
        this.ZoomOut();
      }
      // ホイールした前後で位置関係が変わらないようPictureBoxを移動させる
      double z = this._zoom / 100f;
      this._pictureBox.Left = -((int)(originX * z) - offsetX);
      this._pictureBox.Top = -((int)(originY * z) - offsetY);
      //Debug.WriteLine($"ratio={ratio} e=({e.X},{e.Y}) PB=({pictureBox1.Left},{pictureBox1.Top})");
    }

    public void Fit(bool fit) {
      this._fit = fit;
      if (this._fit) {
        this._zoom = -1;
        this._pictureBox.SizeMode = PictureBoxSizeMode.Zoom;
        this._pictureBox.Dock = DockStyle.Fill;
      } else {
        this.Zoom(100);
        this._pictureBox.SizeMode = PictureBoxSizeMode.AutoSize;
        this._pictureBox.Dock = DockStyle.None;
      }
      this._pictureBox.Refresh();
    }

    private void Zoom(int zoom) {
      if (this._zoom == zoom) return;
      // PictureBox の画像破棄
      this._pictureBox.Image.Dispose();
      this._zoom = zoom;
      // 拡大率に応じた System.Drawing.Bitmap を生成
      double z = this._zoom / 100f;
      this._pictureBox.Image = new Bitmap(this._image, new Size(
        (int)(this._image.Width * z),
        (int)(this._image.Height * z)
      ));
    }

    public void ZoomIn() {
      if (this._fit) return;
      int z = (int)(this._zoom * 1.5);
      if (z <= 500) {
        this.Zoom(z);
      }
    }

    public void ZoomOut() {
      if (this._fit) return;
      int z = (int)(this._zoom * 0.66);
      if (z >= 20) {
        this.Zoom(z);
      }
    }

    public Image Image {
      set {
        this._image?.Dispose();
        this._pictureBox.Image?.Dispose();
        this._image = value;
        this._pictureBox.Image = value.Clone() as Image;
      }
    }

    [Obsolete("このプロパティは非推奨です。Image プロパティを使ってください。")]
    public string Path {
      get { return this._path; }
      set {
        this._path = value;
        this._image?.Dispose();
        this._pictureBox.Image?.Dispose();
        if (this._path != null) {
          this._image = ImageUtil.CreateImage(this._path);
          this._pictureBox.Image = this._image.Clone() as Image;
        }
      }
    }

  }

}

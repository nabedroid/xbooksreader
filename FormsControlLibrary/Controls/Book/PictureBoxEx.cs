using System.Drawing;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  /// <summary>
  /// TODO: 画像を小さくした状態でFITをONにすると解像度が低い状態で引き延ばされて画像がぼやける
  /// </summary>
  public partial class PictureBoxEx : UserControl {

    private IPictureBoxExCommand _command;

    public PictureBoxEx() {
      InitializeComponent();
      this._command = new PictureBoxExCommand(this);
      this.pictureBox1.MouseClick += this._command.MouseClick;
      this.pictureBox1.MouseDown += this._command.MouseDown;
      this.pictureBox1.MouseUp += this._command.MouseUp;
      this.pictureBox1.MouseMove += this._command.MouseMove;
      this.pictureBox1.MouseWheel += this._command.MouseWheel;
    }

    public string Path {
      get { return this._command.Path; }
      set { this._command.Path = value; }
    }

    public Image Image {
      set {
        _command.Image = value;
      }
    }

    public PictureBox PictureBox {
      get { return this.pictureBox1; }
    }

    public void Fit(bool fit) {
      this._command.Fit(fit);
    }

  }
}

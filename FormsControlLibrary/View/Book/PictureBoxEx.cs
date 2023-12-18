using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  public partial class PictureBoxEx : UserControl {

    private IPictureBoxExControl _control;

    public PictureBoxEx() {
      InitializeComponent();
      this._control = new PictureBoxExControl(this);
      this.pictureBox1.MouseClick += this._control.MouseClick;
      this.pictureBox1.MouseDown += this._control.MouseDown;
      this.pictureBox1.MouseUp += this._control.MouseUp;
      this.pictureBox1.MouseMove += this._control.MouseMove;
      this.pictureBox1.MouseWheel += this._control.MouseWheel;
    }

    public string Path {
      get { return this._control.Path; }
      set { this._control.Path = value; }
    }

    public PictureBox PictureBox {
      get { return this.pictureBox1; }
    }

    public void Fit(bool fit) {
      this._control.Fit(fit);
    }

  }
}

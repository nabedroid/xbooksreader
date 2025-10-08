using System.Drawing;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  internal interface IPictureBoxExCommand {
    void MouseClick(object sender, MouseEventArgs e);
    void MouseDown(object sender, MouseEventArgs e);
    void MouseUp(object sender, MouseEventArgs e);
    void MouseMove(object sender, MouseEventArgs e);
    void MouseWheel(object sender, MouseEventArgs e);
    void Fit(bool fit);
    void ZoomIn();
    void ZoomOut();
    Image Image { set; }
    string Path { get; set; }
  }

}

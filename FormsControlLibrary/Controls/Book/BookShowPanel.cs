using Nabedroid.XBooksReader.Common;
using System;
using System.Diagnostics;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  public partial class BookShowPanel : UserControl {

    private IBookShowPanelCommand _control;
    private Book _book;

    public BookShowPanel() {
      InitializeComponent();
      this.checkBox1.Checked = true;
      _control = new BookShowPanelCommand(this);
      this.bindingNavigator1.BindingSource = this.bindingSource1;
      this.pictureBoxEx1.DataBindings.Add(new Binding("Path", this.bindingSource1, ""));
      this.checkBox1.CheckedChanged += this._control.Fit;
      //this.Book = new Book() { Path = "D:\\hhh\\doujin\\FGO\\イシュタル、エレシュキガル\\女神メイドのご奉仕" };
      
      // パスを System.Drawing.Image に変換して表示するバインディング
      /*
      Binding pictureBoxDataBinding = new Binding("Image", this.bindingSource1, "", true, DataSourceUpdateMode.Never, null);
      pictureBoxDataBinding.Format += new ConvertEventHandler( (Object sender, ConvertEventArgs e) => {
        // System.Drawing.Image 以外の変換は行わない（多分いらないけど何となく実装）
        if (e.DesiredType != typeof(System.Drawing.Image)) return;
        e.Value = System.Drawing.Image.FromFile((string)e.Value);
      });
      // ナビゲータに画像パスリストをバインディング
      this.bindingNavigator1.BindingSource = this.bindingSource1;
      // ピクチャボックスにパスを変換するバイディングを追加
      this.pictureBox1.DataBindings.Add(pictureBoxDataBinding);
      */
    }

    public PictureBoxEx PictureBoxEx {
      get { return this.pictureBoxEx1; }
    }

    public BindingSource BindingSource {
      get { return this.bindingSource1; }
    }

    public Book Book {
      set {
        this._book = value;
        //this.bindingSource1.DataSource = value;
        this._control.Book = value;
      }
    }
  }
}

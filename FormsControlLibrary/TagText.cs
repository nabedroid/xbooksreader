using System;
using System.Diagnostics;
using System.Windows.Forms;

namespace FormsControlLibrary {
  public partial class TagText : UserControl {
    // タグ情報とUIのバインディングソース
    private BindingSource _bindingSource;
    // 本のタグ情報
    private Tag _bookTag;
    // タグのText部分をクリックした際のイベントハンドラ
    public event EventHandler TagTextClick;
    // タグのButton部分をクリックした際のイベントハンドラ
    public event EventHandler TagButtonClick;

    public TagText() {
      InitializeComponent();
      this._bindingSource = new BindingSource() {
        DataSource = new Tag()
      };
      this.tagName.DataBindings.Add("Text", this._bindingSource, "name");
    }

    // タグ情報が更新された場合はバインディングソースも更新
    public Tag BookTag {
      get { return this._bookTag; }
      set {
        this._bookTag = value;
        this._bindingSource.DataSource = value;
      }
    }

    private void tableLayoutPanel1_Paint(object sender, PaintEventArgs e) {

    }

    // タグのTextをクリックした際のイベント
    private void tagName_Click(object sender, EventArgs e) {
      EventHandler handler = TagTextClick;
      this._bookTag.Name = "hello world";
      handler?.Invoke(this, e);
    }

    // タグのButtonをクリックした際のイベント
    private void xButton_Click(object sender, EventArgs e) {
      EventHandler handler = TagButtonClick;
      handler?.Invoke(this, e);
    }
  }
}

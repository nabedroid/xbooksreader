using Nabedroid.XBooksReader.Common;
using System;
using System.Collections.ObjectModel;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  public partial class BookListControl : UserControl {

    public EventHandler BookButtonClick;

    private BookListControlCommand _command;
    /// <summary>
    /// ソート項目ComboBoxに登録するアイテムクラス
    /// </summary>
    public class ComboBoxSortItem {
      /// <summary>
      /// 表示名
      /// </summary>
      public string Display { get; }
      /// <summary>
      /// 表示名に対応するBookButton比較クラス
      /// </summary>
      public BookButtonComparer Comparer { get; }
      public ComboBoxSortItem(string display, BookButtonComparer comparer) {
        Display = display;
        Comparer = comparer;
      }
      /// <summary>
      /// クラスを文字列に変換する
      /// ComboBoxでテキストを表示する際に呼ばれる
      /// </summary>
      /// <returns>表示名</returns>
      public override string ToString() { return Display; }
    }

    /// <summary>
    /// コンストラクタ
    /// </summary>
    public BookListControl() : base() {
      InitializeComponent();

      _comboBoxSort.Items.AddRange(new object[] {
        new ComboBoxSortItem("通常", new BookButtonComparerId()),
        new ComboBoxSortItem("評価", new BookButtonComparerEvalution()),
      });
      _comboBoxSort.SelectedIndex = 0;

      _checkBoxFavorite.CheckedChanged += CheckBoxFavoriteCheckChanged;
      _checkBoxDesc.CheckedChanged += CheckBoxDescCheckedChanged;
      _comboBoxSort.SelectionChangeCommitted += ComboBoxSortSelectionChangeCommited;

      _command = new BookListControlCommand(this);
    }

    /// <summary>
    /// オブジェクトを破棄する
    /// </summary>
    /// <param name="disposing"></param>
    protected override void Dispose(bool disposing) {
      if (disposing && (components != null)) {
        components.Dispose();
        // イベントハンドラを削除する
        _checkBoxFavorite.CheckedChanged -= CheckBoxFavoriteCheckChanged;
        _checkBoxDesc.CheckedChanged -= CheckBoxDescCheckedChanged;
        _comboBoxSort.SelectionChangeCommitted -= ComboBoxSortSelectionChangeCommited;
      }
      base.Dispose(disposing);
    }

    /// <summary>
    /// お気に入りチェックボックスの値が変更されたらソートを行う
    /// </summary>
    /// <param name="sender">_checkBoxFavorite</param>
    /// <param name="e">未設定</param>
    private void CheckBoxFavoriteCheckChanged(object sender, EventArgs e) {
      _command.Sort();
    }

    /// <summary>
    /// 降順チェックボックスの値が変更されたらソートを行う
    /// </summary>
    /// <param name="sender">_checkBoxDesc</param>
    /// <param name="e">未設定</param>
    private void CheckBoxDescCheckedChanged(object sender, EventArgs e) {
      _command.Sort();
    }

    /// <summary>
    /// ソート項目コンボボックスの値が変更されたらソートを行う
    /// </summary>
    /// <param name="sender">_comboBoxSort</param>
    /// <param name="e">未設定</param>
    private void ComboBoxSortSelectionChangeCommited(object sender, EventArgs e) {
      _command.Sort();
    }

    public ComboBox ComboBoxSort { get { return _comboBoxSort; } }
    public CheckBox CheckBoxDesc { get { return _checkBoxDesc; } }
    public CheckBox CheckBoxFavorite { get { return _checkBoxFavorite; } }
    public FlowLayoutPanel FlowLayoutPanelBottom { get { return _flowLayoutPanelBottom; } }
    public ControlCollection ButtonControls { get { return _flowLayoutPanelBottom.Controls; } }
    public ObservableCollection<Book> Books { set { _command.Books = value; } }

  }

}
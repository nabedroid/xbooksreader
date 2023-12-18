using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Forms;

using Nabedroid.XBooksReader.Common;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  public class TreeNodeObserve : TreeNode, INotifyPropertyChanged, IDisposable {

    public event PropertyChangedEventHandler PropertyChanged;

    private string _sortKey;

    public TreeNodeObserve() : base() { }

    public TreeNodeObserve(ITreeNodeObservableItem item) : base() {
      Tag = item;
    }

    /// <summary>
    /// プロパティ更新時にオブザーバーへ通知する
    /// </summary>
    /// <param name="propertyName">プロパティ名</param>
    private void NotifyPropertyChanged([CallerMemberName] string propertyName = "") {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    /// <summary>
    /// ObservableItem のプロパティ更新に併せて自信のプロパティも更新する
    /// </summary>
    /// <param name="sender">ITreeNodeObserableItem</param>
    /// <param name="e">PropertyChangedEventArgs</param>
    private void ItemPropertyChange(object sender, PropertyChangedEventArgs e) {
      ITreeNodeObservableItem item = sender as ITreeNodeObservableItem;
      Name = item.Key;
      Text = item.Text;
      SortKey = item.SortKey;
    }

    /// <summary>
    /// オブジェクトを破棄する
    /// </summary>
    public void Dispose() {
      Dispose(true);
    }

    /// <summary>
    /// オブジェクトを破棄する
    /// </summary>
    /// <param name="disposing">明示的に呼び出したか否か</param>
    public void Dispose(bool disposing) {
      if (disposing) {
        INotifyPropertyChanged observable = Tag as INotifyPropertyChanged;
        if (observable != null) {
          observable.PropertyChanged -= ItemPropertyChange;
        }
      }
    }

    /// <summary>
    /// 名前
    /// TreeNodeCollection.Find のキー名に使うので一意になるのが好ましい
    /// </summary>
    public new string Name {
      get { return base.Name; }
      private set {
        if (base.Name != value) {
          base.Name = value;
          NotifyPropertyChanged();
        }
      }
    }

    /// <summary>
    /// 画面上に表示されるテキスト
    /// </summary>
    public new string Text {
      get { return base.Text; }
      private set {
        if (base.Text != value) {
          base.Text = value;
          NotifyPropertyChanged();
        }
      }
    }

    /// <summary>
    /// 付加データ
    /// </summary>
    public new object Tag {
      get { return base.Tag; }
      set {
        if (base.Tag != value) {
          // イベントハンドラ解放
          Dispose();
          base.Tag = value;
          NotifyPropertyChanged();
          // Observableの場合は各プロパティも更新する
          ITreeNodeObservableItem item = value as ITreeNodeObservableItem;
          if (item != null) {
            Name = item.Key;
            Text = item.Text;
            SortKey = item.SortKey;
            item.PropertyChanged += ItemPropertyChange;
          }
        }
      }
    }

    /// <summary>
    /// ソートキー
    /// </summary>
    public string SortKey {
      get { return _sortKey; }
      set {
        if (_sortKey != value) {
          _sortKey = value;
          NotifyPropertyChanged();
        }
      }
    }

  }

}

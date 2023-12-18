using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Collections.Generic;

namespace Nabedroid.XBooksReader.Common {

  public class Tag : ITreeNodeObservableItem {

    public event PropertyChangedEventHandler PropertyChanged;

    private void NotifyPropertyChanged([CallerMemberName] string propertyName = "") {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    public Tag() { }

    private int _id;
    public int Id {
      get { return this._id; }
      set {
        if (this._id != value) {
          this._id = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    private string _name;
    public string Name {
      get { return this._name; }
      set {
        if (this._name != value) {
          this._name = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    private string _kana;
    public string Kana {
      get { return this._kana; }
      set {
        if (this._kana != value) {
          this._kana = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    private List<int> _relations;
    public List<int> Relations {
      get { return this._relations; }
      set {
        if (this._relations != value) {
          this._relations = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    string ITreeNodeObservableItem.Key { get { return this._id.ToString(); } }
    string ITreeNodeObservableItem.Text { get { return this._name; } }
    string ITreeNodeObservableItem.SortKey { get { return this._kana; } }

  }

}
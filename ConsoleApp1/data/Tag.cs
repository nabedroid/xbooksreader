using System.ComponentModel;
using System.Runtime.CompilerServices;

public class Tag : INotifyPropertyChanged {
  public event PropertyChangedEventHandler PropertyChanged;

  private void NotifyPropertyChanged([CallerMemberName] string propertyName = "") {
    PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
  }

  public Tag() {}

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

  private string _yomikata;
  public string Yomikata {
    get { return this._yomikata; }
    set {
      if (this._yomikata != value) {
        this._yomikata = value;
        this.NotifyPropertyChanged();
      }
    }
  }

  private int[] _relations;
  public int[] Relations {
    get { return this._relations; }
    set {
      if (this._relations != value) {
        this._relations = value;
        this.NotifyPropertyChanged();
      }
    }
  }
}

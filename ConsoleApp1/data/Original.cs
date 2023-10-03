using System.ComponentModel;
using System.Runtime.CompilerServices;

public class Original : INotifyPropertyChanged {
  public event PropertyChangedEventHandler PropertyChanged;

  private void NotifyPropertyChanged([CallerMemberName] string propertyName = "") {
    PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
  }

  public Original() {}

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
}

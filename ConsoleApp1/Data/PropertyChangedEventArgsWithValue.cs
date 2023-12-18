using System.ComponentModel;

namespace Nabedroid.XBooksReader.Common {

  public class PropertyChangedEventArgsWithValue : PropertyChangedEventArgs {

    private object _oldValue = null;
    private object _newValue = null;

    public PropertyChangedEventArgsWithValue(string propertyName) : base(propertyName) {
    }

    public PropertyChangedEventArgsWithValue(string propertyName, object oldValue, object newValue) : base(propertyName) {
      this._oldValue = oldValue;
      this._newValue = newValue;
    }

    public object OldValue { get {  return _oldValue; } }
    public object NewValue { get { return _newValue;; } }
  }
}

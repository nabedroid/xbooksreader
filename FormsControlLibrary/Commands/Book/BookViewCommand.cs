using Nabedroid.XBooksReader.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;

namespace Nabedroid.XBooksReader.FormsControlLibrary {
  public class BookViewCommand {

    public event PropertyChangedEventHandler CurrentIndexChanged;
    public event PropertyChangedEventHandler CountChanged;

    private int _currentIndex;
    private List<string> _imagePathList;
    private Book _book;
    private BookViewControl _bookViewControl;

    public BookViewCommand(BookViewControl bookViewControl) {
      this._bookViewControl = bookViewControl;
      _currentIndex = -1;
    }

    public void MoveNext() {
      CurrentIndex = _currentIndex + 1;
    }

    public void MoveLast() {
      CurrentIndex = _imagePathList.Count - 1;
    }

    public void MovePrevious() {
      CurrentIndex = _currentIndex - 1;
    }

    public void MoveFirst() {
      CurrentIndex = 0;
    }

    public int CurrentIndex {
      get {
        return _currentIndex;
      }
      private set {
        _currentIndex = value;
        if (_currentIndex >= _imagePathList.Count) {
          _currentIndex = _imagePathList.Count - 1;
        } else if (_currentIndex < 0) {
          _currentIndex = 0;
        } else {
          CurrentIndexChanged?.Invoke(this, new PropertyChangedEventArgs("CurrentInde"));
        }
      }
    }

    public int Count {
      get {
        return _imagePathList?.Count ?? -1;
      }
    }

    public Image CurrentImage {
      get {
        Image image = null;
        if (_imagePathList != null) {
          string imagePath = _imagePathList[CurrentIndex];
          image = _book.GetBookImageFactory().GetImage(imagePath);
        }
        return image;
      }
    }

    public Book Book {
      set {
        _book = value;
        _currentIndex = -1;
        _imagePathList?.Clear();
        if (value != null) {
          _imagePathList = _book.GetBookImageFactory().GetImagePathList();
          foreach (var p in  _imagePathList) {
            Debug.WriteLine(p);
          }
          // TODO: Windowsの自然な形でソート
          CurrentIndex = 0;
          CountChanged?.Invoke(this, new PropertyChangedEventArgs("Count"));
        }
      }
    }

  }

}

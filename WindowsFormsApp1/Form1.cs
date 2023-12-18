using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WindowsFormsApp1.Model;

namespace WindowsFormsApp1 {
  public partial class Form1 : Form {

    private Random _random = new Random();
    private Data _data;

    public Form1() {

      InitializeComponent();

      toolStripMenuItemAdd.Click += (object sender, EventArgs e) => {
        _data.Add(GetRandomCharacter());
      };
      toolStripMenuItemRemove.Click += (object sender, EventArgs e) => {
        if (_data.Characters.Count < 1) return;

        int index = new Random().Next(_data.Characters.Count);
        Character removeItem = _data.Characters.Values.ElementAt(index);
        _data.Characters.Remove(removeItem.Id);
      };
      toolStripMenuItemEdit.Click += (object sender, EventArgs e) => {
        if (_data.Characters.Count < 1) return;

        int index = new Random().Next(_data.Characters.Count);
        Character changeItem = _data.Characters.Values.ElementAt(index);
        changeItem.Name = GetRandomString();
      };
      myTabControl1.TreeNodeMouseClick += (object sender, TreeNodeMouseClickEventArgs e) => {
        //TreeNodeObserve node = e.Node as TreeNodeObserve;
        //ITreeNodeObservableItem item = node?.Tag as ITreeNodeObservableItem;
        //if (item != null) {
        //  rightPanelLabel.Text = item.Text;
        //}
        rightPanelLabel.Text = e.Node.Text;
      };
      
    }

    public Data Data {
      get { return _data; }
      set {
        _data = value;
        myTabControl1.Data = value;
      }
    }

    private Character GetRandomCharacter() {
      return new Character { Id = GetRandomString(), Name = GetRandomString(), Description = GetRandomString() };
    }

    private string GetRandomString(int length = 5) {
      string chars = "abcdefghijklmnopqrstuvwxyz";
      StringBuilder sb = new StringBuilder();
      for (int i = 0; i < length; i++) {
        sb.Append(chars[_random.Next(26)]);
      }
      return sb.ToString();
    }
  }
}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WindowsFormsApp1.Model;

namespace WindowsFormsApp1 {
  public partial class MyTabControl : UserControl {

    private Data _data;
    public event TreeNodeMouseClickEventHandler TreeNodeMouseClick;

    public MyTabControl() {
      InitializeComponent();
      treeView1.TreeNodeMouseClick += (object sender, TreeNodeMouseClickEventArgs e) => {
        TreeNodeMouseClick?.Invoke(sender, e);
      };
    }

    public Data Data {
      get {  return _data; }
      set {
        _data = value;
        treeView1.ObservableDictionary = _data?.Characters;
      }
    }
  }
}

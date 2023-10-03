using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Diagnostics;

namespace FormsControlLibrary {
  public partial class UserControl1: UserControl {
    public UserControl1() {
      InitializeComponent();
      var layout = this.flowLayoutPanel1.Controls;
      var tagText = new TagText();
      var tag = new Tag() {
        Name = "aaaa"
      };
      
      tagText.BookTag = tag;
      //tagText.TagTextClick += this.OnTagTextClick;
      //tagText.TagButtonClick += this.OnTagButtonClick;
      /*
      var bindingSource = new BindingSource();
      bindingSource.DataSource = tag;
      tagText.DataBindings.Add("Text", bindingSource, "name");
      */
      layout.Add(tagText);
      Debug.WriteLine("UseControl1 Created");
    }

    private void UserControl1_Load(object sender, EventArgs e) {

    }

    private void flowLayoutPanel1_Paint(object sender, PaintEventArgs e) {

    }

    private void OnTagTextClick(object sender, EventArgs e) {
      TagText tagText = (TagText)sender;
      Debug.WriteLine("UseControl1.OnTagTextClick " + tagText.BookTag.Name);
    }

    private void OnTagButtonClick(object sender, EventArgs e) {
      TagText tagText = (TagText)sender;
      Debug.WriteLine("UseControl1.OnTagButtonClick " + tagText.BookTag.Name);
    }
  }
}

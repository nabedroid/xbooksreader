using System.Windows.Forms;
using WindowsFormsApp1.Model;

namespace WindowsFormsApp1 {
  public class SearchTabTreeViewCharacter : AbstractSearchTabTreeView<string, Character> {

    protected override void InitializeTreeView() {
      for (int i = 'a'; i <= 'z'; i++) {
        string alphabet = char.ConvertFromUtf32(i);
        _treeView.Nodes.Add(alphabet, alphabet);
      }
    }

    protected override void Add(TreeNode node) {
      string alphabet = node.Text[0].ToString().ToLower();
      _treeView.Nodes[alphabet].Nodes.Add(node);
    }

  }
}

using System.Windows.Forms;
using WindowsFormsApp1.Model;

namespace WindowsFormsApp1 {
  public class SearchTabTreeViewHome : AbstractSearchTabTreeView<string, Character> {

    protected override void InitializeTreeView() {
      var node1 = _treeView.Nodes.Add("高評価");
      var node2 = _treeView.Nodes.Add("表示回数");
      var node3 = _treeView.Nodes.Add("作成日時");
    }

    protected override void Add(TreeNode node) {
    }

  }
}

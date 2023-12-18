using Nabedroid.XBooksReader.Common;
using System;
using System.Windows.Forms;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  internal class SearchTabHomeTreeView : AbstractSearchTabTreeView<string, string> {

    protected override void InitializeTreeView() {
      TreeNode countNode = _treeView.Nodes.Add("表示回数", "表示回数");
      TreeNode recentlyNode = _treeView.Nodes.Add("最近追加", "最近追加");
      TreeNode evalNode = _treeView.Nodes.Add("高評価", "高評価");
    }

    protected override void Add(TreeNode node) {
      throw new NotImplementedException();
    }

  }

}

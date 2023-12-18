using Nabedroid.XBooksReader.Common;
using System.Windows.Forms;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  internal class SearchTabTagTreeView : AbstractSearchTabTreeView<string, Tag> {

    protected override void InitializeTreeView() {
      foreach (string[] dan in StringUtil.Gojuuon) {
        TreeNode danNode = _treeView.Nodes.Add(dan[0]);
        foreach (string katakana in dan) {
          danNode.Nodes.Add(katakana);
        }
      }
    }

    protected override void Add(TreeNode node) {
      TreeNodeObserve treeNodeObserver = node as TreeNodeObserve;
      ITreeNodeObservableItem item = treeNodeObserver?.Tag as ITreeNodeObservableItem;
      if (item != null) {
        string kanaGyou = StringUtil.GetKanaGyou(item.SortKey);
        string kanaRetsu = StringUtil.GetKanaRetsu(item.SortKey);
        _treeView.Nodes[kanaGyou].Nodes[kanaRetsu].Nodes.Add(node);
      }
    }

  }

}

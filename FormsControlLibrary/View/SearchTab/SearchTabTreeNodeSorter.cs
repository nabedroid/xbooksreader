using System.Collections;
using System.Windows.Forms;
using Nabedroid.XBooksReader.Common;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  public class SearchTabTreeNodeSorter : IComparer {

    public int Compare(object x, object y) {

      TreeNode tx = x as TreeNode;
      TreeNode ty = y as TreeNode;

      string keyX = (x as TreeNode).Text;
      string keyY = (y as TreeNode).Text;

      keyX = (x as ITreeNodeObservableItem)?.SortKey ?? keyX;
      keyY = (x as ITreeNodeObservableItem)?.SortKey ?? keyY;

      return string.Compare(keyX, keyY);
    }

  }

}
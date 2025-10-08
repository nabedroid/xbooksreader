namespace Nabedroid.XBooksReader {
  partial class MainForm {
    /// <summary>
    /// 必要なデザイナー変数です。
    /// </summary>
    private System.ComponentModel.IContainer components = null;

    /// <summary>
    /// 使用中のリソースをすべてクリーンアップします。
    /// </summary>
    /// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
    protected override void Dispose(bool disposing) {
      if (disposing && (components != null)) {
        components.Dispose();
      }
      base.Dispose(disposing);
    }

    #region Windows フォーム デザイナーで生成されたコード

    /// <summary>
    /// デザイナー サポートに必要なメソッドです。このメソッドの内容を
    /// コード エディターで変更しないでください。
    /// </summary>
    private void InitializeComponent() {
      this.splitContainer1 = new System.Windows.Forms.SplitContainer();
      this.menuStrip1 = new System.Windows.Forms.MenuStrip();
      this.toolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
      this.toolStripMenuItemOpen = new System.Windows.Forms.ToolStripMenuItem();
      this.toolStripMenuItemSave = new System.Windows.Forms.ToolStripMenuItem();
      this.toolStripMenuItemSaveAs = new System.Windows.Forms.ToolStripMenuItem();
      this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
      this.toolStripMenuItemUpdate = new System.Windows.Forms.ToolStripMenuItem();
      this.toolStripMenuItemAddDirectory = new System.Windows.Forms.ToolStripMenuItem();
      this.toolStripSeparator2 = new System.Windows.Forms.ToolStripSeparator();
      this.toolStripMenuItemExit = new System.Windows.Forms.ToolStripMenuItem();
      this.searchTab1 = new Nabedroid.XBooksReader.FormsControlLibrary.SearchTabView();
      this.bookListPanel1 = new Nabedroid.XBooksReader.FormsControlLibrary.BookListControl();
      ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).BeginInit();
      this.splitContainer1.Panel1.SuspendLayout();
      this.splitContainer1.Panel2.SuspendLayout();
      this.splitContainer1.SuspendLayout();
      this.menuStrip1.SuspendLayout();
      this.SuspendLayout();
      // 
      // splitContainer1
      // 
      this.splitContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.splitContainer1.Location = new System.Drawing.Point(0, 24);
      this.splitContainer1.Name = "splitContainer1";
      // 
      // splitContainer1.Panel1
      // 
      this.splitContainer1.Panel1.Controls.Add(this.searchTab1);
      // 
      // splitContainer1.Panel2
      // 
      this.splitContainer1.Panel2.Controls.Add(this.bookListPanel1);
      this.splitContainer1.Size = new System.Drawing.Size(1140, 614);
      this.splitContainer1.SplitterDistance = 276;
      this.splitContainer1.TabIndex = 0;
      // 
      // menuStrip1
      // 
      this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripMenuItem1});
      this.menuStrip1.Location = new System.Drawing.Point(0, 0);
      this.menuStrip1.Name = "menuStrip1";
      this.menuStrip1.Size = new System.Drawing.Size(1140, 24);
      this.menuStrip1.TabIndex = 1;
      this.menuStrip1.Text = "menuStrip1";
      // 
      // toolStripMenuItem1
      // 
      this.toolStripMenuItem1.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripMenuItemOpen,
            this.toolStripMenuItemSave,
            this.toolStripMenuItemSaveAs,
            this.toolStripSeparator1,
            this.toolStripMenuItemUpdate,
            this.toolStripMenuItemAddDirectory,
            this.toolStripSeparator2,
            this.toolStripMenuItemExit});
      this.toolStripMenuItem1.Name = "toolStripMenuItem1";
      this.toolStripMenuItem1.Size = new System.Drawing.Size(53, 20);
      this.toolStripMenuItem1.Text = "ファイル";
      // 
      // toolStripMenuItemOpen
      // 
      this.toolStripMenuItemOpen.Name = "toolStripMenuItemOpen";
      this.toolStripMenuItemOpen.Size = new System.Drawing.Size(161, 22);
      this.toolStripMenuItemOpen.Text = "開く";
      // 
      // toolStripMenuItemSave
      // 
      this.toolStripMenuItemSave.Name = "toolStripMenuItemSave";
      this.toolStripMenuItemSave.Size = new System.Drawing.Size(161, 22);
      this.toolStripMenuItemSave.Text = "保存";
      // 
      // toolStripMenuItemSaveAs
      // 
      this.toolStripMenuItemSaveAs.Name = "toolStripMenuItemSaveAs";
      this.toolStripMenuItemSaveAs.Size = new System.Drawing.Size(161, 22);
      this.toolStripMenuItemSaveAs.Text = "名前を付けて保存";
      // 
      // toolStripSeparator1
      // 
      this.toolStripSeparator1.Name = "toolStripSeparator1";
      this.toolStripSeparator1.Size = new System.Drawing.Size(158, 6);
      // 
      // toolStripMenuItemUpdate
      // 
      this.toolStripMenuItemUpdate.Name = "toolStripMenuItemUpdate";
      this.toolStripMenuItemUpdate.Size = new System.Drawing.Size(161, 22);
      this.toolStripMenuItemUpdate.Text = "更新";
      // 
      // toolStripMenuItemAddDirectory
      // 
      this.toolStripMenuItemAddDirectory.Name = "toolStripMenuItemAddDirectory";
      this.toolStripMenuItemAddDirectory.Size = new System.Drawing.Size(161, 22);
      this.toolStripMenuItemAddDirectory.Text = "フォルダ追加";
      // 
      // toolStripSeparator2
      // 
      this.toolStripSeparator2.Name = "toolStripSeparator2";
      this.toolStripSeparator2.Size = new System.Drawing.Size(158, 6);
      // 
      // toolStripMenuItemExit
      // 
      this.toolStripMenuItemExit.Name = "toolStripMenuItemExit";
      this.toolStripMenuItemExit.Size = new System.Drawing.Size(161, 22);
      this.toolStripMenuItemExit.Text = "終了";
      // 
      // searchTab1
      // 
      this.searchTab1.BackColor = System.Drawing.SystemColors.Control;
      this.searchTab1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.searchTab1.Location = new System.Drawing.Point(0, 0);
      this.searchTab1.Name = "searchTab1";
      this.searchTab1.Size = new System.Drawing.Size(276, 614);
      this.searchTab1.TabIndex = 0;
      // 
      // bookListPanel1
      // 
      this.bookListPanel1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.bookListPanel1.Location = new System.Drawing.Point(0, 0);
      this.bookListPanel1.Name = "bookListPanel1";
      this.bookListPanel1.Size = new System.Drawing.Size(860, 614);
      this.bookListPanel1.TabIndex = 0;
      // 
      // MainForm
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.ClientSize = new System.Drawing.Size(1140, 638);
      this.Controls.Add(this.splitContainer1);
      this.Controls.Add(this.menuStrip1);
      this.Name = "MainForm";
      this.Text = "Form1";
      this.splitContainer1.Panel1.ResumeLayout(false);
      this.splitContainer1.Panel2.ResumeLayout(false);
      ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).EndInit();
      this.splitContainer1.ResumeLayout(false);
      this.menuStrip1.ResumeLayout(false);
      this.menuStrip1.PerformLayout();
      this.ResumeLayout(false);
      this.PerformLayout();

    }

    #endregion

    private System.Windows.Forms.SplitContainer splitContainer1;
    private FormsControlLibrary.SearchTabView searchTab1;
    private FormsControlLibrary.BookListControl bookListPanel1;
    private System.Windows.Forms.MenuStrip menuStrip1;
    private System.Windows.Forms.ToolStripMenuItem toolStripMenuItem1;
    private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemOpen;
    private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemSaveAs;
    private System.Windows.Forms.ToolStripSeparator toolStripSeparator1;
    private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemUpdate;
    private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemAddDirectory;
    private System.Windows.Forms.ToolStripSeparator toolStripSeparator2;
    private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemExit;
    private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemSave;
  }
}


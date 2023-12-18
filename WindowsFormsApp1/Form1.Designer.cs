namespace WindowsFormsApp1 {
  partial class Form1 {
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
      this.menuStrip1 = new System.Windows.Forms.MenuStrip();
      this.toolStripMenuItemAdd = new System.Windows.Forms.ToolStripMenuItem();
      this.toolStripMenuItemRemove = new System.Windows.Forms.ToolStripMenuItem();
      this.toolStripMenuItemEdit = new System.Windows.Forms.ToolStripMenuItem();
      this.splitContainer1 = new System.Windows.Forms.SplitContainer();
      this.myTabControl1 = new WindowsFormsApp1.MyTabControl();
      this.rightPanelLabel = new System.Windows.Forms.Label();
      this.menuStrip1.SuspendLayout();
      ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).BeginInit();
      this.splitContainer1.Panel1.SuspendLayout();
      this.splitContainer1.Panel2.SuspendLayout();
      this.splitContainer1.SuspendLayout();
      this.SuspendLayout();
      // 
      // menuStrip1
      // 
      this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripMenuItemAdd,
            this.toolStripMenuItemRemove,
            this.toolStripMenuItemEdit});
      this.menuStrip1.Location = new System.Drawing.Point(0, 0);
      this.menuStrip1.Name = "menuStrip1";
      this.menuStrip1.Size = new System.Drawing.Size(800, 24);
      this.menuStrip1.TabIndex = 0;
      this.menuStrip1.Text = "menuStrip1";
      // 
      // toolStripMenuItemAdd
      // 
      this.toolStripMenuItemAdd.Name = "toolStripMenuItemAdd";
      this.toolStripMenuItemAdd.Size = new System.Drawing.Size(41, 20);
      this.toolStripMenuItemAdd.Text = "Add";
      // 
      // toolStripMenuItemRemove
      // 
      this.toolStripMenuItemRemove.Name = "toolStripMenuItemRemove";
      this.toolStripMenuItemRemove.Size = new System.Drawing.Size(61, 20);
      this.toolStripMenuItemRemove.Text = "Remove";
      // 
      // toolStripMenuItemEdit
      // 
      this.toolStripMenuItemEdit.Name = "toolStripMenuItemEdit";
      this.toolStripMenuItemEdit.Size = new System.Drawing.Size(39, 20);
      this.toolStripMenuItemEdit.Text = "Edit";
      // 
      // splitContainer1
      // 
      this.splitContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.splitContainer1.Location = new System.Drawing.Point(0, 24);
      this.splitContainer1.Name = "splitContainer1";
      // 
      // splitContainer1.Panel1
      // 
      this.splitContainer1.Panel1.Controls.Add(this.myTabControl1);
      // 
      // splitContainer1.Panel2
      // 
      this.splitContainer1.Panel2.Controls.Add(this.rightPanelLabel);
      this.splitContainer1.Size = new System.Drawing.Size(800, 426);
      this.splitContainer1.SplitterDistance = 266;
      this.splitContainer1.TabIndex = 1;
      // 
      // myTabControl1
      // 
      this.myTabControl1.Data = null;
      this.myTabControl1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.myTabControl1.Location = new System.Drawing.Point(0, 0);
      this.myTabControl1.Name = "myTabControl1";
      this.myTabControl1.Size = new System.Drawing.Size(266, 426);
      this.myTabControl1.TabIndex = 0;
      // 
      // rightPanelLabel
      // 
      this.rightPanelLabel.AutoSize = true;
      this.rightPanelLabel.Font = new System.Drawing.Font("MS UI Gothic", 36F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
      this.rightPanelLabel.Location = new System.Drawing.Point(70, 99);
      this.rightPanelLabel.Name = "rightPanelLabel";
      this.rightPanelLabel.Size = new System.Drawing.Size(135, 48);
      this.rightPanelLabel.TabIndex = 0;
      this.rightPanelLabel.Text = "label1";
      // 
      // Form1
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.ClientSize = new System.Drawing.Size(800, 450);
      this.Controls.Add(this.splitContainer1);
      this.Controls.Add(this.menuStrip1);
      this.MainMenuStrip = this.menuStrip1;
      this.Name = "Form1";
      this.Text = "Form1";
      this.menuStrip1.ResumeLayout(false);
      this.menuStrip1.PerformLayout();
      this.splitContainer1.Panel1.ResumeLayout(false);
      this.splitContainer1.Panel2.ResumeLayout(false);
      this.splitContainer1.Panel2.PerformLayout();
      ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).EndInit();
      this.splitContainer1.ResumeLayout(false);
      this.ResumeLayout(false);
      this.PerformLayout();

    }

    #endregion

    private System.Windows.Forms.MenuStrip menuStrip1;
    private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemAdd;
    private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemRemove;
    private System.Windows.Forms.SplitContainer splitContainer1;
    private MyTabControl myTabControl1;
    private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemEdit;
    private System.Windows.Forms.Label rightPanelLabel;
  }
}


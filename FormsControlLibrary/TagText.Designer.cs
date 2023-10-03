namespace FormsControlLibrary {
  partial class TagText {
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

    #region コンポーネント デザイナーで生成されたコード

    /// <summary> 
    /// デザイナー サポートに必要なメソッドです。このメソッドの内容を 
    /// コード エディターで変更しないでください。
    /// </summary>
    private void InitializeComponent() {
      this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
      this.tagButton = new System.Windows.Forms.Button();
      this.tagName = new System.Windows.Forms.Label();
      this.tableLayoutPanel1.SuspendLayout();
      this.SuspendLayout();
      // 
      // tableLayoutPanel1
      // 
      this.tableLayoutPanel1.AutoSize = true;
      this.tableLayoutPanel1.ColumnCount = 2;
      this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
      this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 20F));
      this.tableLayoutPanel1.Controls.Add(this.tagButton, 1, 0);
      this.tableLayoutPanel1.Controls.Add(this.tagName, 0, 0);
      this.tableLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.tableLayoutPanel1.Location = new System.Drawing.Point(0, 0);
      this.tableLayoutPanel1.Name = "tableLayoutPanel1";
      this.tableLayoutPanel1.RowCount = 1;
      this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
      this.tableLayoutPanel1.Size = new System.Drawing.Size(66, 26);
      this.tableLayoutPanel1.TabIndex = 0;
      this.tableLayoutPanel1.Paint += new System.Windows.Forms.PaintEventHandler(this.tableLayoutPanel1_Paint);
      // 
      // tagButton
      // 
      this.tagButton.Location = new System.Drawing.Point(49, 3);
      this.tagButton.Name = "tagButton";
      this.tagButton.Size = new System.Drawing.Size(14, 20);
      this.tagButton.TabIndex = 1;
      this.tagButton.Text = "×";
      this.tagButton.UseVisualStyleBackColor = true;
      this.tagButton.Click += new System.EventHandler(this.xButton_Click);
      // 
      // tagName
      // 
      this.tagName.AutoSize = true;
      this.tagName.Cursor = System.Windows.Forms.Cursors.Hand;
      this.tagName.Dock = System.Windows.Forms.DockStyle.Fill;
      this.tagName.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
      this.tagName.Location = new System.Drawing.Point(3, 0);
      this.tagName.Name = "tagName";
      this.tagName.Size = new System.Drawing.Size(40, 26);
      this.tagName.TabIndex = 2;
      this.tagName.Text = "default";
      this.tagName.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
      this.tagName.Click += new System.EventHandler(this.tagName_Click);
      // 
      // TagText
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.AutoSize = true;
      this.Controls.Add(this.tableLayoutPanel1);
      this.Name = "TagText";
      this.Size = new System.Drawing.Size(66, 26);
      this.tableLayoutPanel1.ResumeLayout(false);
      this.tableLayoutPanel1.PerformLayout();
      this.ResumeLayout(false);
      this.PerformLayout();

    }

    #endregion

    private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
    private System.Windows.Forms.Button tagButton;
    private System.Windows.Forms.Label tagName;
  }
}

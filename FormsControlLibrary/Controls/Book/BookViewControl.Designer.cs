namespace Nabedroid.XBooksReader.FormsControlLibrary {
  partial class BookViewControl {
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
      this.splitContainer1 = new System.Windows.Forms.SplitContainer();
      this.flowLayoutPanel1 = new System.Windows.Forms.FlowLayoutPanel();
      this._doublePrevButton = new System.Windows.Forms.Button();
      this._prevButton = new System.Windows.Forms.Button();
      this._currentPageLabel = new System.Windows.Forms.Label();
      this.label3 = new System.Windows.Forms.Label();
      this._totalPageLabel = new System.Windows.Forms.Label();
      this._nextButton = new System.Windows.Forms.Button();
      this._doubleNextButton = new System.Windows.Forms.Button();
      this._fitCheckBox = new System.Windows.Forms.CheckBox();
      this._pictureBoxEx = new Nabedroid.XBooksReader.FormsControlLibrary.PictureBoxEx();
      ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).BeginInit();
      this.splitContainer1.Panel1.SuspendLayout();
      this.splitContainer1.Panel2.SuspendLayout();
      this.splitContainer1.SuspendLayout();
      this.flowLayoutPanel1.SuspendLayout();
      this.SuspendLayout();
      // 
      // splitContainer1
      // 
      this.splitContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.splitContainer1.Location = new System.Drawing.Point(0, 0);
      this.splitContainer1.Name = "splitContainer1";
      this.splitContainer1.Orientation = System.Windows.Forms.Orientation.Horizontal;
      // 
      // splitContainer1.Panel1
      // 
      this.splitContainer1.Panel1.Controls.Add(this._pictureBoxEx);
      // 
      // splitContainer1.Panel2
      // 
      this.splitContainer1.Panel2.Controls.Add(this.flowLayoutPanel1);
      this.splitContainer1.Size = new System.Drawing.Size(632, 484);
      this.splitContainer1.SplitterDistance = 453;
      this.splitContainer1.TabIndex = 0;
      // 
      // flowLayoutPanel1
      // 
      this.flowLayoutPanel1.Controls.Add(this._doublePrevButton);
      this.flowLayoutPanel1.Controls.Add(this._prevButton);
      this.flowLayoutPanel1.Controls.Add(this._currentPageLabel);
      this.flowLayoutPanel1.Controls.Add(this.label3);
      this.flowLayoutPanel1.Controls.Add(this._totalPageLabel);
      this.flowLayoutPanel1.Controls.Add(this._nextButton);
      this.flowLayoutPanel1.Controls.Add(this._doubleNextButton);
      this.flowLayoutPanel1.Controls.Add(this._fitCheckBox);
      this.flowLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.flowLayoutPanel1.Location = new System.Drawing.Point(0, 0);
      this.flowLayoutPanel1.Name = "flowLayoutPanel1";
      this.flowLayoutPanel1.Size = new System.Drawing.Size(632, 27);
      this.flowLayoutPanel1.TabIndex = 0;
      // 
      // _doublePrevButton
      // 
      this._doublePrevButton.Location = new System.Drawing.Point(3, 3);
      this._doublePrevButton.Name = "_doublePrevButton";
      this._doublePrevButton.Size = new System.Drawing.Size(75, 23);
      this._doublePrevButton.TabIndex = 0;
      this._doublePrevButton.Text = "<<";
      this._doublePrevButton.UseVisualStyleBackColor = true;
      // 
      // _prevButton
      // 
      this._prevButton.Location = new System.Drawing.Point(84, 3);
      this._prevButton.Name = "_prevButton";
      this._prevButton.Size = new System.Drawing.Size(75, 23);
      this._prevButton.TabIndex = 1;
      this._prevButton.Text = "<";
      this._prevButton.UseVisualStyleBackColor = true;
      // 
      // _currentPageLabel
      // 
      this._currentPageLabel.Font = new System.Drawing.Font("MS UI Gothic", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
      this._currentPageLabel.Location = new System.Drawing.Point(165, 0);
      this._currentPageLabel.Name = "_currentPageLabel";
      this._currentPageLabel.Size = new System.Drawing.Size(52, 26);
      this._currentPageLabel.TabIndex = 5;
      this._currentPageLabel.Text = "999";
      this._currentPageLabel.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
      // 
      // label3
      // 
      this.label3.Font = new System.Drawing.Font("MS UI Gothic", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
      this.label3.Location = new System.Drawing.Point(223, 0);
      this.label3.Name = "label3";
      this.label3.Size = new System.Drawing.Size(10, 23);
      this.label3.TabIndex = 7;
      this.label3.Text = "/";
      this.label3.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
      // 
      // _totalPageLabel
      // 
      this._totalPageLabel.Font = new System.Drawing.Font("MS UI Gothic", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
      this._totalPageLabel.Location = new System.Drawing.Point(239, 0);
      this._totalPageLabel.Name = "_totalPageLabel";
      this._totalPageLabel.Size = new System.Drawing.Size(48, 23);
      this._totalPageLabel.TabIndex = 6;
      this._totalPageLabel.Text = "999";
      this._totalPageLabel.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
      // 
      // _nextButton
      // 
      this._nextButton.Location = new System.Drawing.Point(293, 3);
      this._nextButton.Name = "_nextButton";
      this._nextButton.Size = new System.Drawing.Size(75, 23);
      this._nextButton.TabIndex = 2;
      this._nextButton.Text = ">";
      this._nextButton.UseVisualStyleBackColor = true;
      // 
      // _doubleNextButton
      // 
      this._doubleNextButton.Location = new System.Drawing.Point(374, 3);
      this._doubleNextButton.Name = "_doubleNextButton";
      this._doubleNextButton.Size = new System.Drawing.Size(75, 23);
      this._doubleNextButton.TabIndex = 3;
      this._doubleNextButton.Text = ">>";
      this._doubleNextButton.UseVisualStyleBackColor = true;
      // 
      // _fitCheckBox
      // 
      this._fitCheckBox.AutoSize = true;
      this._fitCheckBox.Location = new System.Drawing.Point(455, 3);
      this._fitCheckBox.Name = "_fitCheckBox";
      this._fitCheckBox.Size = new System.Drawing.Size(38, 16);
      this._fitCheckBox.TabIndex = 4;
      this._fitCheckBox.Text = "Fit";
      this._fitCheckBox.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
      this._fitCheckBox.UseVisualStyleBackColor = true;
      // 
      // _pictureBoxEx
      // 
      this._pictureBoxEx.Dock = System.Windows.Forms.DockStyle.Fill;
      this._pictureBoxEx.Location = new System.Drawing.Point(0, 0);
      this._pictureBoxEx.Name = "_pictureBoxEx";
      this._pictureBoxEx.Path = null;
      this._pictureBoxEx.Size = new System.Drawing.Size(632, 453);
      this._pictureBoxEx.TabIndex = 0;
      // 
      // BookViewControl
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.Controls.Add(this.splitContainer1);
      this.Name = "BookViewControl";
      this.Size = new System.Drawing.Size(632, 484);
      this.splitContainer1.Panel1.ResumeLayout(false);
      this.splitContainer1.Panel2.ResumeLayout(false);
      ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).EndInit();
      this.splitContainer1.ResumeLayout(false);
      this.flowLayoutPanel1.ResumeLayout(false);
      this.flowLayoutPanel1.PerformLayout();
      this.ResumeLayout(false);

    }

    #endregion

    private System.Windows.Forms.SplitContainer splitContainer1;
    private System.Windows.Forms.FlowLayoutPanel flowLayoutPanel1;
    private System.Windows.Forms.Button _doublePrevButton;
    private System.Windows.Forms.Button _prevButton;
    private System.Windows.Forms.Button _nextButton;
    private System.Windows.Forms.Button _doubleNextButton;
    private System.Windows.Forms.CheckBox _fitCheckBox;
    private System.Windows.Forms.Label _currentPageLabel;
    private System.Windows.Forms.Label label3;
    private System.Windows.Forms.Label _totalPageLabel;
    private Nabedroid.XBooksReader.FormsControlLibrary.PictureBoxEx _pictureBoxEx;
  }
}

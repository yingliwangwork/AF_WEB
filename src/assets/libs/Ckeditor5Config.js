export default {
  /**
   * 不重複heading中h1~h6有的數值，可以自行設定
   *
   * 畫面顯示的選單也會套用對應的樣式
   *
   * 若設太大會因為字高導致清單內其他的選項點不到
   */
  fontSize: {
    options: [14, "default", 18, 36, 48, 72],
    supportAllValues: true, // true: "options"可以使用數值設定
  },
  /**
   * 該參考表是設定heading的預設值大小
   *
   * 若要設定fontSize，也可以參考(請避免設定一樣的大小)
   *
   * | heading | html實際顯示大小(rem) | heading下拉式選單內的大小(非實際html)|
   * | ------- | --------------------- | ----------------------------------- |
   * | h1      | 6                     | 50px                                |
   * | h2      | 3.75                  | 36px                                |
   * | h3      | 3                     | 30px                                |
   * | h4      | 2.125                 | 21.25px                             |
   * | h5      | 1.5                   | 15px                                |
   * | h6      | 1.25                  | 12.5px                              |
   */
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Heading 5",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6",
        view: "h6",
        title: "Heading 6",
        class: "ck-heading_heading6",
      },
    ],
  },
  /**
   * 上傳路徑設定，設定方式跟ckeditor4一樣，只是物件名稱不一樣
   */
  simpleUpload: {
    uploadUrl: "",
  },
  /**
   * 設置工具列的功能 (預設是設置全功能，請依照自己的需求移除不需要的)
   *
   * | 英文工具列名稱        | 中文功能列名稱                        |
   * | --------------------- | ------------------------------------ |
   * | Heading               | h1-h6(預設值只有h1-h3)                |
   * | Alignment             | 段落(靠左/靠右/置中)                  |
   * | HorizontalLine        | 水平線                                |
   * | --------------------- | ------------------------------------- |
   * | Bold                  | 粗體                                  |
   * | Italic                | 斜體                                  |
   * | Underline             | 底線                                  |
   * | RemoveFormat          | 移除格式                              |
   * | --------------------- | ------------------------------------- |
   * | FontBackgroundColor   | 文字背景顏色                          |
   * | FontColor             | 文字顏色                              |
   * | FontSize              | 文字大小(預設值是中文，不是數值)       |
   * | --------------------- | ------------------------------------- |
   * | bulletedList          | 符號清單                              |
   * | numberedList          | 有序清單                              |
   * | --------------------- | ------------------------------------- |
   * | outdent               | 減少縮排                              |
   * | indent                | 增加縮排                              |
   * | --------------------- | ------------------------------------- |
   * | Link                  | 連結                                  |
   * | ImageUpload           | 上傳圖片                              |
   * | blockQuote            | 段落引用                              |
   * | insertTable           | 插入表格                              |
   * | MediaEmbed            | 影音功能                              |
   * | --------------------- | ------------------------------------- |
   * | undo                  | 取消                                  |
   * | redo                  | 重作                                  |
   */
  toolbar: {
    items: [
      "heading",
      "alignment",
      "horizontalLine",
      "|",
      "bold",
      "italic",
      "underline",
      "removeFormat",
      "|",
      "fontBackgroundColor",
      "fontColor",
      "fontSize",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "outdent",
      "indent",
      "|",
      "link",
      "imageUpload",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "|",
      "undo",
      "redo",
    ],
  },
  /**
   * 刪除plugin設置 (想清楚再設置, 設置完請開F12 debug)
   *
   * Image            => 圖片功能載入
   * ImageCaption     => 增加圖片說明(圖片下方)
   * ImageStyle       => 控制圖片出現在文字的哪裡
   * ImageToolbar     => 圖片工具條
   * IndentBlock      => 縮排方塊功能(搭配Indent一起用)
   * List             => 符號清單/有序清單
   * PasteFromOffice  => 可以從Office複製內容，並貼上ckEditor
   * Table            => 表格功能
   * TableToolbar     => 表格工具條(欄/列/合併儲存格)
   */
  // , removePlugins: ["Table"]
};

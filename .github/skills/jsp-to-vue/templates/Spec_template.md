# <元件名稱> 規格書

## 元件契約
**元件名稱**:
**元件輸入**:
> 範例:
> - appId: string - 受理編號
> - showAppId?: boolean = true - 是否顯示受理編號
> 如果沒有輸入參數則填寫無: **元件輸入**: 無

**元件輸出**:
> 範例：
> - close: EventEmitter<void> - 關閉彈窗事件
> 如果沒有輸出參數則填寫無: **元件輸出**: 無

**元件插槽**:
> 範例：
> - containerRight - 右側內容
> - default - 主要內容
> 如果沒有插槽則填寫無: **元件插槽**: 無

---

## 視覺設計
**DTCG**:
```yaml
```
> 參照 W3C 規範，提供 DTCG 樣式(需完整列出，包含樣式屬性，如: `bgColor`)

**ASCII Wireframe**:
```plaintext
```
> 完整繪製所有靜態元素，提供完整的佈局資訊

---

## 使用者案例
### UC-<流水號> - <使用者案例名稱>
**使用者案例描述**: <使用者案例描述>
**前置條件**: <前置條件>
**主流程**:

**替代流程**:
**事後條件**: <事後條件>

---

## 外部相依
### API
#### <API 名稱>
**API Endpoint**: <API Endpoint>
**API Method**: <API Method>
**API Request**:
**API Response**:

### 元件
#### <元件名稱>
**元件類型**: <元件類型: page / layout / component...>
**元件輸入**:
**元件輸出**:
**元件插槽**:

### 其他相依
#### <External 名稱>
**輸入參數**:
**輸出參數**:
**主要功能**: 
**標記**: 

> 若有未知語法或技術缺口，請在此標記
> 範例:
> ### displayMessage
> **輸入參數**: 無
> **輸出參數**: 無
> **主要功能**: Unknown
> **標記**: TODO: [未知語法] - displayMessage() 

> ### toROC
> **輸入參數**:
>   - value: string(`YYYY/MM/DD` | `YYYY-MM-DD`) - 西元日期
> **輸出參數**:
>   - value: string(`YYY/MM/DD`) - 民國日期
> **主要功能**: 將西元日期轉換為民國日期
> **標記**: TODO: [技術缺口] - 將 <value> 由西元日期(`YYYY/MM/DD` | `YYYY-MM-DD`) 轉換為民國日期(`YYY/MM/DD`)


// InterestForm.js
import { useState } from "react";
import { fields } from "interfaces/fields";
import { getAuthHeaders } from "lib/api/auth";
import client from "lib/api/client";

const InterestForm = (props) => {
  const [selectedFields, setSelectedFields] = useState([]);

  const handleFieldChange = (fieldId) => {
    // 選択された分野のIDを更新
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };


  const handleSubmit = () => {
    // 選択された分野のIDを数字に変換して送信データに含める
    const selectedFieldNumbers = selectedFields.map(String);

    const formData = selectedFieldNumbers.map((number) => ({
      field_id: number,
    }));
    
    console.log(formData);

    client.post('/fields', { formData },
    { headers: getAuthHeaders() })
    .then(response => {
      console.log('Field data sent successfully:', response.data);
      props.onNext()
    })
    .catch(error => {
      console.error('Error sending rating data:', error);
    });


    // ここで formData をサーバーに送信するか、必要な処理を実行する
    console.log(formData);
  };

  return (
    <div>
      <h2>興味のある分野を選択してください</h2>
      <form>
        {fields.map((field) => (
          <div key={field.id}>
            <label>
              <input
                type="checkbox"
                value={field.id}
                checked={selectedFields.includes(field.id)}
                onChange={() => handleFieldChange(field.id)}
              />
              {field.name}
            </label>
          </div>
        ))}
        <button type="button" onClick={handleSubmit}>
          送信
        </button>
      </form>
    </div>
  );
};

export default InterestForm;

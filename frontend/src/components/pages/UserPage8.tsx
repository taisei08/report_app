// InterestForm.js
import { useState, useEffect } from "react";
import { fields } from "interfaces/fields";
import { getAuthHeaders } from "lib/api/auth";
import client from "lib/api/client";
import SettingsMenu from "components/utils/SettingsMenu";

const UserProfileEditPage8 = () => {
  const [selectedFields, setSelectedFields] = useState([]);

  useEffect(() => {
    // ページが読み込まれたときにユーザーデータを取得する
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // ユーザーデータをAPIから取得
      const response = await client.get("/fields",
      { headers: getAuthHeaders() });
      console.log(response.data)
      setSelectedFields(prevSelectedFields => [
        ...prevSelectedFields,
        ...response.data.fields
          .map(field => field.fieldId)
          .filter(newFieldId => !prevSelectedFields.includes(newFieldId))
      ]);
        
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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

    client.put('/fields', { formData },
    { headers: getAuthHeaders() })
    .then(response => {
      console.log('Field data sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending rating data:', error);
    });


    // ここで formData をサーバーに送信するか、必要な処理を実行する
    console.log(formData);
  };

  return (
    <div>
      <SettingsMenu/>
      <h2>興味のある分野を選択してください</h2>
      {console.log(selectedFields)}
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

export default UserProfileEditPage8;

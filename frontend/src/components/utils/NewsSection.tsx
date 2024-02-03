import { useState, useEffect } from "react";
import client from "lib/api/client";
import { fields } from "interfaces/fields";
import { getAuthHeaders } from "lib/api/auth";
import FieldArticles from "./FieldArticles";
import { Link } from "react-router-dom";

const NewsSection = () => {
  const [selectedFields, setSelectedFields] = useState([]); // 初期値は分野1
  const [selectedField, setSelectedField] = useState();
  
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
      setSelectedField(response.data.fields[0].fieldId)
      setSelectedFields(prevSelectedFields => [
        ...prevSelectedFields,
        ...response.data.fields.map(field => field.fieldId)
      ]);
        
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleFieldChange = (fieldId) => {
    setSelectedField(fieldId);
  };

  return (
    <>
      {selectedFields && selectedFields.length > 0 && (
        <div>
          <h2>{`${fields.find((field) => field.id === selectedField)?.name || 'Unknown'}分野の新着記事`}</h2>
          <FieldArticles fieldId={selectedField} />
          <div style={{ display: "flex" }}>
            {selectedFields.map((fieldId) => (
              <button key={fieldId} onClick={() => handleFieldChange(fieldId)}>
                {`${fields.find((field) => field.id === fieldId)?.name || 'Unknown'}`}
              </button>
            ))}
            <Link to={`/search/${fields.find((field) => field.id === selectedField)?.name || 'Unknown'}`}>もっと見る</Link>
          </div>
        </div>
      )}
    </>
  );
  
};

export default NewsSection;

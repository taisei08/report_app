import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@material-ui/core";
import client from "lib/api/client";
import { fields } from "interfaces/fields";
import { getAuthHeaders } from "lib/api/auth";
import FieldArticles from "./FieldArticles";
import { Styles } from "lib/styles";

const NewsSection = () => {
  const importClasses = Styles();
  const [selectedFields, setSelectedFields] = useState<number[] | undefined>([]);
  const [selectedField, setSelectedField] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchUserData();
  }, []);

  interface Field {
    fieldId: number;
    fieldName: string;
  }  

  const fetchUserData = async () => {
    try {
      const response = await client.get("/fields", { headers: getAuthHeaders() });
      const fetchedFields: Field[] = response.data.fields;
      setSelectedField(fetchedFields[0]?.fieldId);
      setSelectedFields(prevSelectedFields => [
        ...(prevSelectedFields || []),
        ...fetchedFields.map((field) => field.fieldId)
      ]);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleFieldChange = (fieldId: number) => {
    setSelectedField(fieldId);
  };

  return (
    <>
      {selectedFields && selectedFields.length > 0 && (
        <Box>
          <Typography variant="h2" gutterBottom style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            カテゴリ:{fields.find(field => field.id === selectedField)?.name || 'Unknown'}の新着記事
          </Typography>
          {selectedField !== undefined && <FieldArticles fieldId={selectedField} />}
          <Box display="flex">
          {selectedFields.map((fieldId) => (
            <Button
              key={fieldId}
              onClick={() => handleFieldChange(fieldId)}
              className={importClasses.button}
            >
              {fields.find((field) => field.id === fieldId)?.name || 'Unknown'}
            </Button>
          ))}
          </Box>
          <Box>
            <Link 
              to={`/search/${fields.find(field => field.id === selectedField)?.name || 'Unknown'}`}
              className={importClasses.linkStyle}
            >
              この分野の記事をもっと見る▶︎
            </Link>
          </Box>
        </Box>
      )}
    </>
  );
};

export default NewsSection;

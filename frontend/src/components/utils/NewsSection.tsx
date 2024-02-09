import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@material-ui/core";
import client from "lib/api/client";
import { fields } from "interfaces/fields";
import { getAuthHeaders } from "lib/api/auth";
import FieldArticles from "./FieldArticles";

const NewsSection = () => {
  const [selectedFields, setSelectedFields] = useState<number[] | undefined>([]); // 初期値は分野1
  const [selectedField, setSelectedField] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchUserData();
  }, []);

  interface Field {
    fieldId: number;
  }  

  const fetchUserData = async () => {
    try {
      const response = await client.get("/fields", { headers: getAuthHeaders() });
      const { fields: fetchedFields } = response.data;
      setSelectedField(fetchedFields[0]?.fieldId);
      setSelectedFields(prevSelectedFields => [
        ...(prevSelectedFields || []),
        ...fetchedFields.map((field: Field) => field.fieldId)
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
          <Typography variant="h2">
            {fields.find(field => field.id === selectedField)?.name || 'Unknown'}分野の新着記事
          </Typography>
          <FieldArticles fieldId={selectedField} />
          <Box display="flex">
            {selectedFields.map(fieldId => (
              <Button key={fieldId} onClick={() => handleFieldChange(fieldId)}>
                {fields.find(field => field.id === fieldId)?.name || 'Unknown'}
              </Button>
            ))}
            <Link to={`/search/${fields.find(field => field.id === selectedField)?.name || 'Unknown'}`}>
              この分野の記事をもっと見る
            </Link>
          </Box>
        </Box>
      )}
    </>
  );
};

export default NewsSection;

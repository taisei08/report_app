import { useState, useEffect } from "react";
import { makeStyles, Card, CardContent, Box, Typography, Checkbox, FormControlLabel, Button, Grid } from "@material-ui/core";
import { fields } from "interfaces/fields";
import { getAuthHeaders } from "lib/api/auth";
import client from "lib/api/client";
import { useFormState } from "../../utils/error/useFormState";
import AlertMessage from 'components/utils/error/AlertMessage';
import SettingsMenu from "components/utils/setting/SettingsMenu";

interface Field {
  id: number;
  name: string;
}

const useStyles = makeStyles((theme) => ({
  cardContent: {
    marginBottom: theme.spacing(2),
  },
  box: {
    border: '1px solid #ccc',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    transition: 'transform 0.3s',
  },
  selectedBox: {
    transform: 'scale(1.05)',
  },
  disabledBox: {
    opacity: '0.7',
  },
}));

const EditInterests: React.FC = () => {
  const classes = useStyles();
  const [formState, setFormState] = useFormState();
  const [selectedFields, setSelectedFields] = useState<number[]>([]);
  const [hoveredField, setHoveredField] = useState<number | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await client.get("/fields", { headers: getAuthHeaders() });
      const newFields = response.data.fields.map((field: { fieldId: number }) => field.fieldId);
      setSelectedFields(prevSelectedFields => {
        const filteredFields: number[] = newFields.filter((newFieldId: number) => !prevSelectedFields.includes(newFieldId));
        return [...prevSelectedFields, ...filteredFields];
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleFieldChange = (fieldId: number) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(id => id !== fieldId));
    } else if (selectedFields.length < 3) {
      setSelectedFields(prevSelectedFields => [...prevSelectedFields, fieldId]);
    }
    setFormState({ isChanged: true });
  };

  const handleSubmit = async () => {
    const formData = selectedFields.map(number => ({ field_id: String(number) }));
    try {
      const response = await client.put("/fields", { fieldId: formData }, { headers: getAuthHeaders() });
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      setFormState({ alertSeverity: 'success', alertMessage: '分野の変更に成功しました' });
      console.log("Field data sent successfully:", response.data);
    } catch (error) {
      setFormState({ alertSeverity: 'error', alertMessage: '分野の変更に失敗しました' });
      console.error("Error sending rating data:", error);
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
    }
  };

  const handleMouseEnter = (fieldId: number) => {
    setHoveredField(fieldId);
  };

  const handleMouseLeave = () => {
    setHoveredField(null);
  };

  return (
    <Box>
      <SettingsMenu />
      <Card>
        <CardContent className={classes.cardContent}>
          <Typography variant="h4" style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
            学問分野
          </Typography>           
          <Typography variant="body2" style={{ marginBottom: '10px' }}>
            興味のある分野を選択してください。分野は3つまで指定できます
          </Typography>
          <Typography variant="body1">
            選択された分野: {selectedFields.length} / 3
          </Typography>
        </CardContent>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={2}>
            {fields.map((field: Field) => (
              <Grid item sm={6} md={4} key={field.id}>
                <Box
                  marginBottom={2}
                  className={`${classes.box} ${
                    hoveredField === field.id ? classes.selectedBox : ''
                  } ${
                    hoveredField && hoveredField !== field.id && selectedFields.includes(field.id)
                      ? classes.disabledBox
                      : ''
                  }`}
                  onMouseEnter={() => handleMouseEnter(field.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFields.includes(field.id)}
                        onChange={() => handleFieldChange(field.id)}
                        style={{ color: selectedFields.includes(field.id) ? 'blue' : 'inherit' }}
                        disabled={selectedFields.length >= 3 && !selectedFields.includes(field.id)}
                      />
                    }
                    label={field.name}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
        <CardContent className={classes.cardContent}>
        <Box style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
            disabled={formState.isSubmitting || !formState.isChanged}
          >
            更新する
          </Button>
        </Box>
        </CardContent>
      </Card>
      {formState.alertSeverity && (
        <AlertMessage
          open={formState.alertMessageOpen}
          setOpen={(isOpen: boolean) => setFormState({ alertMessageOpen: isOpen })}
          severity={formState.alertSeverity}
          message={formState.alertMessage}
        />
      )}
    </Box>
  );
};

export default EditInterests;
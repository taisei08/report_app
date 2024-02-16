import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles, Chip, Card, CardHeader, CardContent, TextField, Button, MenuItem } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import client from "lib/api/client";
import { getAuthHeaders } from "lib/api/auth";
import { Fields } from "interfaces/index";
import { allFields } from 'interfaces/fields';
import { Posts } from 'interfaces/index';
import { useFormState } from 'components/utils/error/useFormState';
import AlertMessage from 'components/utils/error/AlertMessage';
import ConfirmationDialog from 'components/utils/ConfirmationDialog';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiFilledInput-root': {
      backgroundColor: 'white',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      borderRadius: '4px',
    },
    '& .MuiFilledInput-root:hover': {
      backgroundColor: 'white',
    },
  },
}));

interface Props {
  handleIsSuccessful: () => void;
}

const EditInput: React.FC<Props> = ({ handleIsSuccessful }) => {
  const Id = useParams()
  const [formState, setFormState] = useFormState();
  const classes = useStyles();
  const [fields, setFields] = useState<Fields[]>([]);
  const [postData, setPostData] = useState<Posts>({
    title: '',
    description: '',
    fieldId: 0,
    subFieldId: 0,
    tags: []
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    setFields(allFields);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await client.get
      ('/posts_edit', { params: {postId: Id.postId} });
      console.log(response.data.post)
      setPostData(response.data.post);
      const tags: string[]= []
      response.data.post.tags.map((tag: any) => tags.push(tag.tagName));
      setPostData((prevData) => ({
        ...prevData,
        tags: tags
      }));
            setFields(allFields);
    } catch (error) {
      console.error('Failed to fetch fields', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    setFormState({ isChanged: true });
  };

  const handleTagsChange = (e: React.ChangeEvent<{}>, newValue: string[]) => {
    const filteredValue = newValue.filter(tag => tag.trim() !== "");
    const currentTagCount = postData.tags.length;
    if (newValue.length > currentTagCount && currentTagCount >= 10) {
      return;
    }
    setPostData({ ...postData, tags: filteredValue });
    setFormState({ isChanged: true });
  };

  const handleSubmit = async () => {
    setFormState({ alertMessageOpen: false, isSubmitting: true });
    try {
      const response = await client.put('/posts_edit', postData, {
        headers: getAuthHeaders()
      });
      setFormState({ alertSeverity: undefined });
      handleIsSuccessful();
      console.log('Post updated successfully', response.data);
    } catch (error) {
      setFormState({ 
        alertSeverity: 'error', 
        alertMessage: 'アップデートに失敗しました',
        alertMessageOpen: true 
      });
      console.error('Failed to create post', error);
    } finally {
      handleCloseDialog();
      setFormState({ isSubmitting: false, isChanged: false });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  if (fields.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="投稿の詳細" style={{ padding: 20, fontWeight: 'bold', textAlign: "center" }} />
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="タイトル"
            name="title"
            value={postData.title}
            margin="dense"
            onChange={handleChange}
            inputProps={{ maxLength: 80 }}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            label="説明"
            name="description"
            value={postData.description}
            margin="dense"
            multiline
            rows={4}
            onChange={handleChange}
            inputProps={{ maxLength: 400 }}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            select
            label="カテゴリ"
            name="fieldId"
            value={postData.fieldId}
            margin="dense"
            onChange={handleChange}
          >
            <MenuItem value={0} disabled>
              <em>カテゴリを選択してください</em>
            </MenuItem>
            {fields
              .filter(field => field.id !== postData.subFieldId)
              .map(field => (
                <MenuItem key={field.id} value={field.id}>
                  {field.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            variant="outlined"
            fullWidth
            select
            label="サブカテゴリ"
            name="subFieldId"
            value={postData.subFieldId}
            margin="dense"
            onChange={handleChange}
          >
            <MenuItem value={0}>
              指定なし
            </MenuItem>
            {fields
              .filter(field => field.id !== postData.fieldId)
              .map(field => (
                <MenuItem key={field.id} value={field.id}>
                  {field.name}
                </MenuItem>
              ))}
          </TextField>
          <Autocomplete
            className={classes.root}
            multiple
            freeSolo
            options={[]}
            value={postData.tags}
            // @ts-ignore
            onChange={handleTagsChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} label={option} {...getTagProps({ index })}/>
              ))
            }
            renderInput={(params) => (
              <TextField {...params}
                variant="filled" 
                label="タグ" 
                placeholder="タグを入力"
                inputProps={{
                  ...params.inputProps,
                  maxLength: 20
                }}
              />
            )}
          />
          <Button
            onClick={handleOpenDialog}
            type="button"
            variant="contained"
            color="inherit"
            fullWidth
            disabled={!postData.title || !postData.description ||
              postData.fieldId === 0 || formState.isSubmitting || !formState.isChanged}
            style={{ marginTop: '1rem' }}
          >
            更新
          </Button>
        </form>
      </CardContent>
      <ConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleSubmit}
        title="更新内容の確認"
        content="この内容で更新してもよろしいですか？"
        cancelText="戻る"
        confirmText="更新"
      />
      {formState.alertSeverity && (
        <AlertMessage
          open={formState.alertMessageOpen}
          setOpen={(isOpen: boolean) => setFormState({ alertMessageOpen: isOpen })}
          severity={formState.alertSeverity}
          message={formState.alertMessage}
        />
      )}
    </Card>
  );
};

export default EditInput;

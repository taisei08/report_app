import { useState, useEffect } from 'react';
import { makeStyles, Chip, Card, CardHeader, CardContent, TextField, Button, MenuItem } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import client from "lib/api/client";
import { getAuthHeaders } from "lib/api/auth";
import { Fields } from "interfaces/index";
import { allFields } from 'interfaces/fields';
import { Posts } from 'interfaces/index';
import { useFormState } from '../error/useFormState';
import AlertMessage from '../error/AlertMessage';
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
  submitFile: File; // 仮の型
}

const PostDetail: React.FC<Props> = ({ submitFile }) => {
  const [formState, setFormState] = useFormState();
  const classes = useStyles();
  const [fields, setFields] = useState<Fields[]>([]);
  const [postData, setPostData] = useState<Posts>({
    title: '',
    description: '',
    field_id: 0,
    sub_field_id: 0,
    document_path: submitFile,
    tags: []
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    setFields(allFields);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    setFormState({ isChanged: true });
  };

  const handleTagsChange = (e: React.ChangeEvent<{}>, newValue: string[]) => {
    const currentTagCount = postData.tags.length;
    if (newValue.length > currentTagCount && currentTagCount >= 10) {
      return;
    }
    setPostData({ ...postData, tags: newValue });
    setFormState({ isChanged: true });
  };

  const handleSubmit = async () => {
    setFormState({ alertMessageOpen: false, isSubmitting: true });
    
    if (postData.title.trim().length > 80) {
      setFormState({  
        alertSeverity: 'error',
        alertMessage: 'タイトルは80文字以内で入力してください',
        isSubmitting: false,
        alertMessageOpen: true,
        isChanged: false
      });
      handleCloseDialog();
      return;
    }
    
    if (postData.description.trim().length > 400) {
      setFormState({  
        alertSeverity: 'error',
        alertMessage: '説明は400文字以内で入力してください',
        isSubmitting: false,
        alertMessageOpen: true,
        isChanged: false
      });
      handleCloseDialog();
      return;
    }

    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('field_id', String(postData.field_id));
    formData.append('sub_field_id', String(postData.sub_field_id));
    formData.append('document_path', postData.document_path);
    formData.append('tags', JSON.stringify(postData.tags));

    try {
      const response = await client.post('/posts', formData, {
        headers: getAuthHeaders()
      });
      setFormState({ alertSeverity: undefined });
      console.log('Post created successfully', response.data);
    } catch (error) {
      setFormState({ 
        alertSeverity: 'error', 
        alertMessage: 'アップロードに失敗しました',
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
    <Card style={{ width: '90vw' }}>
      <CardHeader title="投稿の詳細" style={{ fontWeight: 'bold', textAlign: "center" }} />
      <CardContent>
        <form>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="タイトル"
            name="title"
            value={postData.title}
            margin="dense"
            onChange={handleChange}
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
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            select
            label="カテゴリ"
            name="field_id"
            value={postData.field_id}
            margin="dense"
            onChange={handleChange}
          >
            <MenuItem value={0} disabled>
              <em>カテゴリを選択してください</em>
            </MenuItem>
            {fields
              .filter(field => field.id !== postData.sub_field_id)
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
            name="sub_field_id"
            value={postData.sub_field_id}
            margin="dense"
            onChange={handleChange}
          >
            <MenuItem value={0}>
              指定なし
            </MenuItem>
            {fields
              .filter(field => field.id !== postData.field_id)
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
              postData.field_id === 0 || formState.isSubmitting || !formState.isChanged}
            style={{ marginTop: '1rem' }}
          >
            投稿
          </Button>
        </form>
      </CardContent>
      <ConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleSubmit}
        title="投稿内容の確認"
        content="この内容で投稿してもよろしいですか？"
        cancelText="戻る"
        confirmText="投稿"
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

export default PostDetail;

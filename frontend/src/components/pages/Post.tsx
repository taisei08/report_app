import { useState, useEffect } from 'react';
import client from "lib/api/client"
import { Posts, Fields } from "interfaces/index"
import { getAuthHeaders } from "lib/api/auth"

const Post: React.FC = () => {
  const [fields, setFields] = useState<Fields[]>([]); 
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    field_id: 0,
    sub_field_id: 0,
    document_path: null,
    document_type: 0,
  });
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get('/fields');
        setFields(response.data.fields); // サーバーからの応答に.fieldsを追加することを確認
      } catch (error) {
        console.error('Failed to fetch fields', error);
      }
    };
  
    fetchData(); // 即時実行
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setPostData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && tag.trim() !== '') {
      if (tags.length < 10) {
        // エンターキーを押したらタグを追加
        setTags([...tags, tag.trim()]);
        setTag('');
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (postData.title.trim() === '' ||
        postData.description.trim() === '' ||
        postData.document_path === null ||
        postData.field_id === 0) {
    // 未記入の場合は送信を防ぐ
    alert('全ての項目を記入してください。');
    return;
  }

            try {
            console.log(postData)
            const response = await client.post('/posts', createFormData(postData), 
            { headers: getAuthHeaders()
            });
            console.log('Post created successfully', response.data);
            } catch (error) {
            console.error('Failed to create post', error);
            }
  };

  const createFormData = (data: Partial<Posts>): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return formData;
  };
  
  if (fields.length === 0) {
    return null;
  }
  

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="title" value={postData.title} onChange={handleChange} />
      </label>
      <br />
      <label>
        Description:
        <textarea name="description" value={postData.description} onChange={handleChange} />
      </label>
      <br />
      <label>
        Document:
        <input type="file" name="document_path" onChange={handleChange} />
      </label>
      <br />
      <label>
        Field:
        <select name="field_id" value={postData.field_id} onChange={handleChange}>
          <option value={0} disabled>Select a field</option>
          {fields.map(field => (
            <option key={field.fieldId} value={field.fieldId}>{field.fieldName}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Sub field:
        <select name="sub_field_id" value={Number(postData.sub_field_id)} onChange={handleChange}>
          <option value={0} disabled>Select a subfield</option>
          {fields
      .filter(field => field.fieldId !== Number(postData.field_id)) // 選択された field を除外
      .map(field => (
          <option key={field.fieldId} value={field.fieldId}>{field.fieldName}</option>
      ))}
        </select>
      </label>
      <br />
      <br />
      {tags.map((t, index) => (
        <div key={index}>{t}</div>
      ))}
      <label>
        Tags:
        <input
          type="text"
          placeholder="Enter a tag"
          value={tag}
          onChange={handleTagChange}
          onKeyPress={handleKeyPress}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
    </div>
  );
  
};

export default Post;
import { useState, useEffect } from 'react';
import client from "lib/api/client"
import { Fields } from "interfaces/index"
import { getAuthHeaders } from "lib/api/auth"
import { WithContext as ReactTags } from 'react-tag-input';
import { useParams } from 'react-router-dom';
import { allFields } from 'interfaces/fields';


const Post4: React.FC = (props) => {
  const Id = useParams()
  const [fields, setFields] = useState<Fields[]>([]); 
  const [postData, setPostData] = useState({
    post_id: 0,
    title: '',
    description: '',
    field_id: 0,
    subFieldId: 0,
    document_path: '',
    document_type: 0,
    tag_name: '',
  });
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, response1] = await Promise.all([
          client.get('/posts_edit', { params: {postId: Id.postId} }),
          client.get('/fields'),
        ]);
        console.log(response.data.posts)
        setPostData(response.data.posts[0]); // サーバーからの応答に.fieldsを追加することを確認
        setFields(allFields);
        setTags(response.data.posts[0].tags.map(tag =>({ id: tag.tagName, text: tag.tagName })))
      } catch (error) {
        console.error('Failed to fetch fields', error);
      }
    };
  
    fetchData(); // 即時実行
  }, []);

  const handleChange = (e) => {
    console.log(postData)

    const { name, value, files } = e.target;
    setPostData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = index => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const convertSetTagsToTagArrays = (setTags) => {
    const tagArray = Object.values(setTags).map(i => i.text);
    return tagArray.map((tag) => ({
      tag_name: tag, // 仮のフィールド名を付与する例
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(postData)

    if (postData.title.trim() === '' ||
        postData.description.trim() === '' ||
        postData.field_id === 0) {
    // 未記入の場合は送信を防ぐ
    alert('全ての項目を記入してください。');
    return;
  }

  const tagObjects = convertSetTagsToTagArrays(tags);
  console.log(tags)
  let Data = postData
  Data = {
    ...Data,
    tag_name: JSON.stringify(tagObjects),
  };

            try {
            const response = await client.put('/posts_edit', createFormData(Data), 
            { headers: getAuthHeaders()
            });
            console.log('Post created successfully', response.data);
            } catch (error) {
            console.error('Failed to create post', error);
            }
  };

  const createFormData = (data): FormData => {
    {console.log(tags)}
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return formData;
  };
  
  return (
    <div>
      <label>
        Title:
        <input type="text" name="title" value={`${postData.title}`} onChange={handleChange} />
      </label>
      <br />
      <label>
        Description:
        <textarea name="description" value={postData.description} onChange={handleChange} />
      </label>
      <br />
      <label>
        Field:
        <select name="fieldId" value={postData.fieldId} onChange={handleChange}>
          <option value={0} disabled>Select a field</option>
          {fields.map(field => (
            <option key={field.id} value={field.id}>{field.name}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Sub field:
        <select name="subFieldId" value={Number(postData.subFieldId)} onChange={handleChange}>
          <option value={0} disabled>Select a subfield</option>
          {fields
      .filter(field => field.id !== Number(postData.fieldId)) // 選択された field を除外
      .map(field => (
          <option key={field.id} value={field.id}>{field.name}</option>
      ))}
        </select>
      </label>
      <br />
      <br />
      <label>
        Tags:
        <ReactTags
          tags={tags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          inputFieldPosition="bottom"
          autocomplete
        />
      </label>
      <br />
      <button type="submit" onClick={handleSubmit}>Update</button>
    </div>
  );
  
};

export default Post4;
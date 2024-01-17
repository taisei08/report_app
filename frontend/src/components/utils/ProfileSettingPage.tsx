import { useState } from "react";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import client from "lib/api/client";
import { getAuthHeaders } from "lib/api/auth";

const ProfileSettingPage = (props) => {

  const [school, setSchool] = useState("");
  const [facultyDepartment, setFacultyDepartment] = useState("");
  const [birthday, setBirthday] = useState('');
  const [error, setError] = useState('');

  const isValidDate = (input) => {
    const selectedDate = new Date(input);
    const currentDate = new Date();

    return (
      !isNaN(selectedDate.getTime()) &&
      selectedDate.getFullYear() >= 1900 &&
      selectedDate <= currentDate
    );
  };

  const handleBirthdayChange = (event) => {
    const inputValue = event.target.value;
    setBirthday(inputValue);

    if (!isValidDate(inputValue)) {
      setError('無効な日付です。有効な日付を入力してください。');
    } else {
      setError('');
    }
  };

  const handleSave = async () => {
    try {

      
      const userData = {
        ...(birthday && { birthday: birthday }),
        ...(facultyDepartment && { facultyDepartment: facultyDepartment }),
        ...(school && { school: school }),
      };
      
      if (school.trim() === '' && facultyDepartment.trim() === '' && birthday.trim() === '') {
        // 必要な情報が入力されていない場合は処理を中止
        return;
      }

      console.log(userData)

      // ユーザーデータを更新するAPIリクエスト
      await client.put("/users/1", createFormData(userData), {
        headers: getAuthHeaders(),
      });
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const createFormData = (data) => {
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
      <p>通っている(卒業した)学校の名前などを入力</p>
      {console.log(school)}
      <TextField
        variant="outlined"
        fullWidth
        label="誕生日"
        value={birthday}
        margin="dense"
        onChange={handleBirthdayChange}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        error={!!error} // エラーがある場合にtrueに設定
        helperText={error} // エラーメッセージを表示
      />
      <TextField
        variant="outlined"
        fullWidth
        label="学校名"
        value={school}
        margin="dense"
        onChange={(event) => setSchool(event.target.value)}
      />
      <TextField
        variant="outlined"
        fullWidth
        label="学部学科"
        value={facultyDepartment}
        margin="dense"
        onChange={(event) => setFacultyDepartment(event.target.value)}
      />
      <Button variant="outlined" color="primary" onClick={() => {
        handleSave()
        props.onNext()}}>
        保存
      </Button>
    </div>
  );
};

export default ProfileSettingPage;

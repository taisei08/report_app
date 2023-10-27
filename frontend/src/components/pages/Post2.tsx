const Post2 = (props) => {
  console.log(props);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    props.handleFileData(droppedFile);
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile)
    props.handleFileData(selectedFile);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}
    >
      <h2>Drag & Drop or Choose a File</h2>
      <input
      type="file"
      onChange={handleFileInputChange}
      accept=".pdf, .doc, .docs"
      />
    </div>
  );
};

export default Post2;
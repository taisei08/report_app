import React from 'react';
import { IconButton } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

interface DownloadButtonProps {
  url: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ url }) => {
  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <IconButton onClick={handleDownload}>
      <GetAppIcon />
    </IconButton>
  );
};

export default DownloadButton;

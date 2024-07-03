// src/ProfilePage.jsx
import React, { useState } from 'react';
import { Container, Avatar, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { styled } from '@emotion/styled';

const ContainerStyled = styled(Container)`
  margin-top: 16px;
`;

const ProfileHeaderStyled = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const AvatarStyled = styled(Avatar)`
  width: 80px;
  height: 80px;
  cursor: pointer;
`;

const ProfileDetailsStyled = styled('div')`
  margin-left: 16px;
`;

const DialogStyled = styled(Dialog)`
  padding: 16px;
`;

const DialogContentStyled = styled(DialogContent)`
  display: flex;
  justify-content: center;
`;

const DialogActionsStyled = styled(DialogActions)`
  justify-content: center;
`;

const ImagePreviewStyled = styled('img')`
  width: 100%;
  max-width: 300px;
  max-height: 300px;
`;

const ProfilePage = () => {
  console.log("ProfilePage component rendered");
  const [open, setOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <ContainerStyled>
      <ProfileHeaderStyled>
        <AvatarStyled src={profilePicture} onClick={handleClickOpen} />
        <ProfileDetailsStyled>
          <Typography variant="h5">Rafi Hasan</Typography>
          <Typography variant="body1">
            Contact: No registered services, you can add some on the settings page.
          </Typography>
          <Typography variant="body1">Biography: Rafi Hasan hasn't added a bio</Typography>
          <Typography variant="body1">Links: Rafi Hasan hasn't added any links</Typography>
        </ProfileDetailsStyled>
      </ProfileHeaderStyled>

      <DialogStyled open={open} onClose={handleClose}>
        <DialogTitle>Select Profile Picture</DialogTitle>
        <DialogContentStyled>
          <input
            accept="image/*"
            type="file"
            style={{ display: 'none' }}
            id="profile-picture-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="profile-picture-upload">
            <Button variant="contained" color="primary" component="span">
              Choose a picture
            </Button>
          </label>
          {profilePicture && <ImagePreviewStyled src={profilePicture} alt="Profile Preview" />}
        </DialogContentStyled>
        <DialogActionsStyled>
          <Button onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActionsStyled>
      </DialogStyled>
    </ContainerStyled>
  );
};

export default ProfilePage;

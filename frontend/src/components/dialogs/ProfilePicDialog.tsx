import React, { useState } from 'react';
import { Container, Avatar, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import styled from '@emotion/styled';

const ProfileContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
`;

const ProfileHeader = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 16px;
`;

const ProfileAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  cursor: pointer;
  margin-bottom: 16px;
`;

const DialogStyled = styled(Dialog)`
  padding: 16px;
`;

const DialogContentStyled = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DialogActionsStyled = styled(DialogActions)`
  justify-content: center;
`;

const ProfileComponent: React.FC = () => {

  const [profilePictureOpen, setProfilePictureOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [editableProfilePicture, setEditableProfilePicture] = useState<string>(profilePicture);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setEditableProfilePicture(e.target.result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleClickOpenProfilePicture = () => {
    setProfilePictureOpen(true);
  };

  const handleCloseProfilePicture = () => {
    setProfilePictureOpen(false);
  };

  const handleSaveProfilePicture = () => {
    setProfilePicture(editableProfilePicture);
    setProfilePictureOpen(false);
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileAvatar src={profilePicture} alt="Profile Picture" onClick={handleClickOpenProfilePicture} />
        <Typography variant="h4">Rafi Hasan</Typography>
      </ProfileHeader>

      <DialogStyled open={profilePictureOpen} onClose={handleCloseProfilePicture}>
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContentStyled>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-picture-upload"
            type="file"
            onChange={handleProfilePictureChange}
          />
          <label htmlFor="profile-picture-upload">
            <Button variant="contained" component="span">
              Choose Profile Picture
            </Button>
          </label>
          {editableProfilePicture && <Avatar src={editableProfilePicture} alt="Profile Picture" style={{ width: 100, height: 100, marginTop: 16 }} />}
        </DialogContentStyled>
        <DialogActionsStyled>
          <Button onClick={handleCloseProfilePicture} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveProfilePicture} color="primary">
            Save
          </Button>
        </DialogActionsStyled>
      </DialogStyled>
    </ProfileContainer>
  );
};

export default ProfileComponent;

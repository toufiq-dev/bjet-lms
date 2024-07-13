import React, { useState } from 'react';
import { Container, Avatar, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
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


/*
const ProfileDetails = styled('div')`
  width: 100%;
  max-width: 600px;
  text-align: left;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
*/
/*
const EditButton = styled(Button)`
  align-self: flex-end;
  margin-top: -48px;
`;
*/

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

const ProfilePage: React.FC = () => {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profilePictureOpen, setProfilePictureOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [contact, setContact] = useState<string>('No registered services, you can add some on the settings page.');
  const [biography, setBiography] = useState<string>('Rafi Hasan hasn\'t added a bio');
  const [links, setLinks] = useState<string>('Rafi Hasan hasn\'t added any links');
  const [editableContact, setEditableContact] = useState<string>(contact);
  const [editableBiography, setEditableBiography] = useState<string>(biography);
  const [editableLinks, setEditableLinks] = useState<string>(links);
  const [editableProfilePicture, setEditableProfilePicture] = useState<string>(profilePicture);

  

  const handleCloseEditProfile = () => {
    setEditProfileOpen(false);
  };

  const handleSaveEditProfile = () => {
    setContact(editableContact);
    setBiography(editableBiography);
    setLinks(editableLinks);
    setEditProfileOpen(false);
  };

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
      
  
      <DialogStyled open={editProfileOpen} onClose={handleCloseEditProfile}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContentStyled>
          <TextField
            margin="dense"
            label="Contact"
            fullWidth
            value={editableContact}
            onChange={(e) => setEditableContact(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Biography"
            fullWidth
            multiline
            rows={4}
            value={editableBiography}
            onChange={(e) => setEditableBiography(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Links"
            fullWidth
            value={editableLinks}
            onChange={(e) => setEditableLinks(e.target.value)}
          />
        </DialogContentStyled>
        <DialogActionsStyled>
          <Button onClick={handleCloseEditProfile} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEditProfile} color="primary">
            Save
          </Button>
        </DialogActionsStyled>
      </DialogStyled>

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

export default ProfilePage;

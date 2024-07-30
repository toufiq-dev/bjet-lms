import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import EditProfilePage from './EditProfile'; 

const ProfilePage: React.FC = () => {
  const [name, setName] = useState('John Doe'); 

  const handleSaveName = (newName: string) => {
    setName(newName);
  };

  const handleCancelEdit = () => {
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Profile</Typography>
        <Typography variant="body1">Name: {name}</Typography>
        <Typography variant="body1">Email: meem@gmail.com</Typography>
        <Typography variant="body1">Contact Number: +1234567890</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary">
          Edit Name
        </Button>
      </Grid>
      
      <Grid item xs={12}>
        <EditProfilePage
          currentName={name}
          onSave={handleSaveName}
          onCancel={handleCancelEdit}
        />
      </Grid>
    </Grid>
  );
};

export default ProfilePage;

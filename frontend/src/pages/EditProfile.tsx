import React, { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';

interface EditProfilePageProps {
  currentName: string; 
  onSave: (newName: string) => void; 
  onCancel: () => void; 
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({
  currentName,
  onSave,
  onCancel,
}) => {
  const [editedName, setEditedName] = useState(currentName);

  const handleSave = () => {
    onSave(editedName);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Edit Profile</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="editedName"
          label="Name"
          variant="outlined"
          fullWidth
          value={editedName}
          onChange={handleNameChange}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" onClick={handleCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditProfilePage;

import React, { useState } from "react";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import useLesson from "../../hooks/useLesson";

type Props = {
    open: boolean;
    onClose: () => void;
    lessonId: string;
    currentTitle: string;
    refetch: () => void;
};

const LessonEditModal: React.FC<Props> = ({ open, onClose, lessonId, currentTitle, refetch }) => {
    const [title, setTitle] = useState(currentTitle);
    const { updateLessonTitle } = useLesson();

    const handleSave = async () => {
        await updateLessonTitle(lessonId, title);
        refetch(); // Refetch the lessons after saving
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 4, backgroundColor: "white", margin: "10% auto", width: 400, borderRadius: 2 }}>
                <Typography variant="h6" mb={2}>Edit Lesson Title</Typography>
                <TextField
                    label="Lesson Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ marginLeft: 2 }}>Save</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default LessonEditModal;

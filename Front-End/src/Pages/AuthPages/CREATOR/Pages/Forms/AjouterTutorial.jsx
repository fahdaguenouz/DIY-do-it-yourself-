import React, { useState } from 'react';
import { Container, TextField, Select, MenuItem, Button, IconButton, Box, Typography, InputLabel, FormControl, Grid } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const AjouterTutorial = () => {
    const [cover, setCover] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [media, setMedia] = useState([{ file: null, description: '', preview: null }]);
    const navigate = useNavigate();

    const handleCoverChange = (event) => {
        const file = event.target.files[0];
        setCover(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setCoverPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleMediaChange = (index, event) => {
        const newMedia = [...media];
        if (event.target.name === 'file') {
            const file = event.target.files[0];
            newMedia[index].file = file;
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newMedia[index].preview = e.target.result;
                    setMedia(newMedia);
                };
                reader.readAsDataURL(file);
            }
        } else {
            newMedia[index].description = event.target.value;
            setMedia(newMedia);
        }
    };

    const handleAddMedia = () => {
        setMedia([...media, { file: null, description: '', preview: null }]);
    };

    const handleBack = () => {
        navigate('/creator/gestion-tutorials');
    };

    const handleRemoveMedia = (index) => {
        const newMedia = media.filter((_, i) => i !== index);
        setMedia(newMedia);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // handle form submission logic here
    };

    return (
        <Container maxWidth="md">
            <Grid container justifyContent="left">
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                >
                    Retour
                </Button>
            </Grid>
            <Typography variant="h4" component="h1" gutterBottom>
                Add New Tutorial
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    border="1px dashed #ccc"
                    borderRadius="8px"
                    padding="16px"
                    marginBottom="16px"
                    bgcolor="#f9f9f9"
                >
                    <Typography variant="h6" gutterBottom>
                        Tutorial Cover
                    </Typography>
                    <input
                        accept="image/*"
                        type="file"
                        name="cover"
                        onChange={handleCoverChange}
                        style={{ marginTop: 8 }}
                    />
                    {coverPreview && (
                        <Box mt={2}>
                            <img src={coverPreview} alt="Cover Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        </Box>
                    )}
                </Box>
                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    required
                />
                <FormControl variant="outlined" fullWidth margin="normal" required>
                    <InputLabel>Category</InputLabel>
                    <Select label="Category">
                        <MenuItem value="category1">Category 1</MenuItem>
                        <MenuItem value="category2">Category 2</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" fullWidth margin="normal" required>
                    <InputLabel>Subcategory</InputLabel>
                    <Select label="Subcategory">
                        <MenuItem value="subcategory1">Subcategory 1</MenuItem>
                        <MenuItem value="subcategory2">Subcategory 2</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Small Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    rows={2}
                    required
                    multiline
                />
                {media.map((m, index) => (
                    <Box padding="16px" border="1px dashed #ccc" borderRadius="8px" key={index} mb={2} display="flex" alignItems="center">
                        <input
                            accept="image/*,video/*"
                            type="file"
                            name="file"
                            onChange={(event) => handleMediaChange(index, event)}
                            style={{ marginRight: 16 }}
                        />
                        {m.preview && (
                            <Box mr={3}>
                                {m.file.type.startsWith('image/') ? (
                                    <img src={m.preview} alt="Media Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                ) : (
                                    <video src={m.preview} controls style={{ maxWidth: '200px', maxHeight: '100px' }} />
                                )}
                            </Box>
                        )}
                        <TextField
                            label="Media Description"
                            variant="outlined"
                            name="description"
                            value={m.description}
                            onChange={(event) => handleMediaChange(index, event)}
                            multiline
                            rows={4}
                            style={{ marginRight: 16, flex: 1 }}
                        />
                        <IconButton sx={{ color: 'red' }} onClick={() => handleRemoveMedia(index)}>
                            <Delete />
                        </IconButton>
                    </Box>
                ))}
                <Button variant="outlined" onClick={handleAddMedia} startIcon={<Add />}>
                    Add Media
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: 16 }}
                >
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default AjouterTutorial;

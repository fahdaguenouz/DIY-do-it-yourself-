import React, { useState, useEffect, useRef } from 'react';
import { Container, TextField, Select, MenuItem, Button, Box, Typography, InputLabel, FormControl, Grid, CircularProgress, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTutorials, updateTutorial } from '@/Redux/authActions';
import toast from 'react-hot-toast';

const UpdateTutorial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { baseUrl, tutorials, categories, loading } = useSelector(state => state.auth);

  const tutorial = tutorials.find(t => t.id === parseInt(id));
  
  const [titre, setTitre] = useState(tutorial?.titre || '');
  const [selectedCategory, setSelectedCategory] = useState(categories.length > 0 ? categories[0].id : '');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [description, setDescription] = useState(tutorial?.description || '');
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(tutorial ? `${baseUrl}storage/${tutorial.cover}` : null);
  const [media, setMedia] = useState(tutorial?.media.map(m => ({
    file: null,
    description: m.description,
    preview: `${baseUrl}storage/${m.media_url}`
  })) || []);
  const originalData = useRef({
    titre: tutorial?.titre || '',
    sub_category_id: tutorial?.sub_category_id || '',
    description: tutorial?.description || '',
    cover: null,
    media: tutorial?.media.map(m => ({
      file: null,
      description: m.description,
      preview: `${baseUrl}storage/${m.media_url}`
    })) || []
  });
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  useEffect(() => {
    if (!tutorial) {
      dispatch(getTutorials());
    }
  }, [dispatch, tutorial]);

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(cat => cat.id === selectedCategory);
      setFilteredSubcategories(category ? category.subcategories : []);
      setSelectedSubcategory(category && category.subcategories.length > 0 ? category.subcategories[0].id : '');
    } else {
      setFilteredSubcategories([]);
      setSelectedSubcategory('');
    }
  }, [selectedCategory, categories]);

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

 const [hasChanges, setHasChanges] = useState(false);

useEffect(() => {
  if (
    titre !== originalData.current.titre ||
    selectedSubcategory !== originalData.current.sub_category_id ||
    description !== originalData.current.description ||
    cover !== null ||
    JSON.stringify(media) !== JSON.stringify(originalData.current.media)
  ) {
    setHasChanges(true);
  } else {
    setHasChanges(false);
  }
}, [titre, selectedSubcategory, description, cover, media]);

// In the handleSubmit function

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!hasChanges) {
      return toast("Nothing to update", { icon: '🤷‍♂️' });
    }

    // Create FormData object for sending the updated data
    const formData = new FormData();
    if (titre) {
      formData.append('titre', titre);
    }
    formData.append('Sub_Categorie_id', selectedSubcategory);
    formData.append('user_id', tutorial.user.id);
    if (description) {
      formData.append('description', description);
    }
    if (cover) {
      formData.append('cover', cover);
    }
    media.forEach((m, index) => {
      if (m.file) {
        formData.append(`media[${index}][file]`, m.file);
        formData.append(`media[${index}][description]`, m.description);
        formData.append(`media[${index}][order]`, index);
      }
    });

    // Dispatch the updateTutorial action
    dispatch(updateTutorial(id, formData))
      .then(() => {
        dispatch(getTutorials());
        navigate(`/creator/gestion-tutorials`);
      })
      .catch((error) => {
        console.error('Error updating tutorial:', error);
      });
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
        Update Tutorial
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Titre"
            name="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sous-catégorie</InputLabel>
            <Select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
            >
              {filteredSubcategories.map((subcategory) => (
                <MenuItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <Box mt={2} mb={2}>
            <Typography variant="h6">Cover:</Typography>
            {coverPreview && <img src={coverPreview} alt="Cover Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />}
            <input type="file" onChange={handleCoverChange} />
          </Box>
          <Typography variant="h6">Media:</Typography>
          {media.map((m, index) => (
            <Box key={index} mb={2}>
              <TextField
                label="Description"
                value={m.description}
                onChange={(e) => handleMediaChange(index, e)}
                fullWidth
                margin="normal"
              />
              {m.preview && (
                <Box mt={1}>
                  {m.file && m.file.type.startsWith('video') ? (
                    <video controls style={{ width: '100%', maxHeight: '300px' }}>
                      <source src={m.preview} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={m.preview} alt={`Preview ${index}`} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                  )}
                </Box>
              )}
              <input type="file" name="file" onChange={(e) => handleMediaChange(index, e)} />
              <IconButton onClick={() => handleRemoveMedia(index)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMedia}
            startIcon={<Add />}
          >
            Ajouter un média
          </Button>
          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Tutorial'}
            </Button>
          </Box>
        </form>
      )}
    </Container>
  );
};

export default UpdateTutorial;

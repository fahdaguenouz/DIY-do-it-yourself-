import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Grid, Avatar, TextField, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory, getTutorials } from '@/Redux/authActions';

const Tutorials = () => {
    const dispatch = useDispatch();
    const { baseUrl, tutorials, categories, user } = useSelector(state => state.auth);
    const [searchTitle, setSearchTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');

    useEffect(() => {
        dispatch(getTutorials());
        dispatch(getCategory());
    }, [dispatch]);

    // Filter tutorials by user and title
    const filteredTutorials = tutorials.filter(tutorial =>
        tutorial.user_id === user.id &&
        tutorial.titre.toLowerCase().includes(searchTitle.toLowerCase())
    );

    // Get subcategories based on selected category
    const subcategories = selectedCategory ? categories.find(cat => cat.id === selectedCategory)?.subcategories : [];

    // Further filter tutorials by selected subcategory
    const finalTutorials = selectedSubcategory ?
        filteredTutorials.filter(tutorial => tutorial.Sub_Categorie_id === selectedSubcategory) :
        filteredTutorials;

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container sx={{ padding: '20px 50px', alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid item>
                    <Typography variant="h4" component="h1">
                        Tutorials
                    </Typography>
                </Grid>
                <Grid item>
                    <Button component={Link} to="/creator/add-tutorial" variant="contained" color="primary">
                        Ajouter
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ padding: '0 50px' }}>
                <Grid item xs={12}>
                    <TextField
                        label="Search by Title"
                        variant="outlined"
                        fullWidth
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        label="Category"
                        value={selectedCategory}
                        onChange={e => {
                            setSelectedCategory(e.target.value);
                            setSelectedSubcategory(''); // Reset subcategory when category changes
                        }}
                        fullWidth
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        label="Subcategory"
                        value={selectedSubcategory}
                        onChange={e => setSelectedSubcategory(e.target.value)}
                        fullWidth
                        disabled={!selectedCategory} // Disable if no category is selected
                    >
                        {subcategories.map((subcat) => (
                            <MenuItem key={subcat.id} value={subcat.id}>
                                {subcat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ padding: '0 50px' }}>
                {finalTutorials.map((tutorial, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ textAlign: 'center', padding: 3, backgroundColor: '#fff' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={`${baseUrl}storage/${tutorial.cover}`}
                                alt={tutorial.titre}
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">{tutorial.titre}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, color: '#039ee3' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fa fa-star" />
                                    ))}
                                    <Typography component="label" sx={{ ml: 0.5 }}>(5.0)</Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'grey',
                                    margin: '20px 0'
                                }}>
                                    <Avatar src={`${baseUrl}${tutorial.user.profile_picture}`} alt={tutorial.user.nom} sx={{
                                        width: 50,
                                        height: 50,
                                        mr: 2
                                    }} />
                                    <Typography variant="body1">{`${tutorial.user.prenom} ${tutorial.user.nom}`}</Typography>
                                </Box>
                                <Box sx={{
                                    backgroundColor: '#f8f8f8',
                                    padding: 1,
                                    margin: '30px 0'
                                }}>
                                    <Typography variant="h6" color="primary">{tutorial.priceAll}</Typography>
                                </Box>
                                <Button 
                                    component={Link}
                                    to={`/creator/tutorial-detail/${tutorial.id}/${encodeURIComponent(tutorial.titre)}`}
                                    variant="outlined"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#039ee3',
                                            color: '#fff',
                                            borderColor: '#039ee3',
                                        }
                                    }}
                                >Visit Now!</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Tutorials;

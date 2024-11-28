import React from 'react';
import { Grid, Paper, Box, Typography, Button } from '@mui/material';
import QuantityButton from './QuantityButton'; // Adjust the import based on your file structure
import { isTokenValid, logout } from '../../../utils/auth';


const ItemCard = ({ item, cart, setCart, addToCart, handleOpenModal,storeStatus,navigate }) => {

    const cartItem = cart.items.find(cartItem => cartItem.id === item.id);

    return (
        <Grid item xs={4} sm={3} md={2} key={item.id}>
            <Paper
                onClick={() => handleOpenModal(item)}
                sx={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    p: 1,
                    height: '200px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'none',
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                    '&:active': {
                        backgroundColor: 'transparent',
                    },
                    '&:focus': {
                        outline: 'none',
                    },
                }}
                tabIndex={0}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '110px',
                        overflow: 'hidden',
                        borderRadius: '4px',
                        backgroundColor: item.image ? 'transparent' : '#f0f0f0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>

                <Typography 
                    variant="subtitle2" 
                    sx={{ 
                        fontSize: '0.70rem', 
                        fontWeight: 500, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: 'vertical', 
                        height: '4rem', 
                        width: '100%',
                        mt: 0.5,
                    }}
                >
                    {item.name}
                </Typography>

                <Typography 
                    variant="body2" 
                    sx={{ 
                        mb: 1, 
                        fontSize: '0.75rem', 
                        color: '#555',
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap', 
                        width: '100%',
                        mt: 0.5,
                    }}
                >
                    ₹{item.price}
                </Typography>

                { storeStatus?.status!=="open" ?   

                
                <Button
                        disableRipple
                        variant="outlined"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                        }}
                        sx={{
                            width: '100%',
                            mt: 'auto',
                            height: '25px',
                            fontSize: '0.65rem',
                            mb: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                boxShadow: 'none',
                            },
                            '&:active': {
                                backgroundColor: '#e0e0e0',
                                boxShadow: 'none',
                            },
                           
                        }}
                        disabled={true}
                    >
                        Store Closed
                    </Button>
                
                : cartItem ? (
                    <QuantityButton 
                        item={item} 
                        cart={cart} 
                        setCart={setCart} 
                        cartItem={cartItem}
                    />
                ) : (
                    <Button
                        disableRipple
                        variant="outlined"
                        onClick={(e) => {
                            e.stopPropagation();

                             if (!isTokenValid()) {
                                    alert('Sign in to Add Cart')
				   // logout(navigate);
				    return
				}
                            addToCart(item);
                        }}
                        sx={{
                            width: '100%',
                            mt: 'auto',
                            height: '25px',
                            fontSize: '0.65rem',
                            mb: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                boxShadow: 'none',
                            },
                            '&:active': {
                                backgroundColor: '#e0e0e0',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Add to Cart
                    </Button>
                )}
            </Paper>
        </Grid>
    );
};

export default ItemCard;


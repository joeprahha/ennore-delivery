import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

const QuantityButton = ({ item, cart, setCart,cartItem,height }) => {

const count=cartItem?.count
    const incrementItemCount = (item) => {
        const existingItem = cart.items.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.count += 1;
        }
        setCart({ ...cart, items: [...cart.items] });
        localStorage.setItem('cart', JSON.stringify({ ...cart, items: [...cart.items] }));
    };

    const decrementItemCount = (item) => {
        const existingItem = cart.items.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            if (existingItem.count > 1) {
                existingItem.count -= 1;
            } else {
                cart.items = cart.items.filter(cartItem => cartItem.id !== item.id);
            }
            setCart({ ...cart, items: [...cart.items] });
            localStorage.setItem('cart', JSON.stringify({ ...cart, items: [...cart.items] }));
        }
    };

    return (
        <Button
            variant="outlined"
            disableRipple
            sx={{
                width: '100%',
                height: height||'25px',
                fontSize: '0.65rem',
                mb: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0',
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
            <Button
                disableRipple
                size="small"
                disableElevation
                onClick={(e) => {
                    e.stopPropagation();
                    decrementItemCount(item);
                }}
                sx={{
                	
                    minWidth:height|| '30px',
                     height: height|| '25px',
                    maxHeight: height||'25px',
                    fontSize: '0.65rem',
                    padding: 0,
                    boxShadow: '1',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: '1',
                    },
                    '&:active': {
                        backgroundColor: 'transparent',
                        boxShadow: '1',
                    },
                }}
            >
                -
            </Button>

            <Typography variant="body2" sx={{ mx: 1, textAlign: 'center', width: '20px' }}>
                {count}
            </Typography>

            <Button
                size="small"
                disableRipple
                disableElevation
                onClick={(e) => {
                    e.stopPropagation();
                    incrementItemCount(item);
                }}
                sx={{
                    minWidth: height ||'30px',
                     height: height|| '25px',
                    maxHeight: height|| '25px',
                    fontSize: '0.65rem',
                    padding: 0,
                    boxShadow: '1',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: '1',
                    },
                    '&:active': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }}
            >
                +
            </Button>
        </Button>
    );
};

export default QuantityButton;


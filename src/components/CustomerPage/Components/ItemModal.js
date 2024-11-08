import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    Dialog,
    AppBar,
    Toolbar,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCartFromLocalStorage, setCartToLocalStorage } from '../../../utils/localStorage';

import { GoToOrdersButton } from './GoToOrdersButton';

const SlideTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ItemDetailModal = ({ open, onClose, item, storeInfo, cart, setCart }) => {
    const [ordersModalOpen, setOrdersModalOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        if (cart?.items?.length) {
            setCartToLocalStorage(cart);
        }
    }, [cart]);
 useEffect(() => {
        if (cart?.items?.length) {
            setCartToLocalStorage(cart);
        }
    }, [setOrdersModalOpen,ordersModalOpen]);


    const getCartItemCount = () => {
        const existingItem = cart?.items?.find(cartItem => cartItem.name === item.name);
        return existingItem ? existingItem.count : quantity;
    };

    const updateCartQuantity = (newQuantity) => {
        const existingItem = cart?.items?.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            if (newQuantity <= 0) {
                setCart({
                    ...cart,
                    items: cart.items.filter(cartItem => cartItem.name !== item.name),
                });
            } else {
                setCart({
                    ...cart,
                    items: cart.items.map(cartItem =>
                        cartItem.name === item.name
                            ? { ...cartItem, count: newQuantity }
                            : cartItem
                    ),
                });
            }
        } else if (newQuantity > 0) {
            const updatedItems = cart.items?.length
                ? [...cart.items, { ...item, storeId: storeInfo._id, storeName: storeInfo.name, count: newQuantity }]
                : [{ ...item, storeId: storeInfo._id, storeName: storeInfo.name, count: newQuantity }];

            setCart({
                ...cart,
                storeId: storeInfo._id,
                storeName: storeInfo.name,
                items: updatedItems,
            });
        }
    };

    const handleAddToCart = (fromInc = false) => {

        if (cart.storeId && cart.storeId !== storeInfo._id) {
            setConfirmationOpen(true);
        } else {
            updateCartQuantity(fromInc ? getCartItemCount() + 1 : getCartItemCount());
        }
    };

    const handleConfirmClearCart = () => {
        setCart({
            storeId: storeInfo._id,
            storeName: storeInfo.name,
            items: [{ ...item, count: 1 }],
        });
        setConfirmationOpen(false);
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={SlideTransition}
        >
            <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">{item.name}</Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Box
                    component="img"
                    src={item.image || storeInfo.logo}
                    alt={item.name}
                    sx={{ width: '100%', height: '40%', objectFit: 'cover', objectPosition: 'center' }}
                />

                <Box sx={{ padding: 2 }}>
                    <Typography variant="h5">{item.name}</Typography>
                    <Typography variant="h6" color="textSecondary">
                        Rs. {item.price}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <IconButton onClick={() => updateCartQuantity(Math.max(getCartItemCount() - 1, 0))}>
                            -
                        </IconButton>
                        <TextField
                            variant="outlined"
                            value={getCartItemCount()}
                            onChange={(e) => updateCartQuantity(Math.max(1, Number(e.target.value)))}
                            sx={{ width: '60px', mx: 1 }}
                        />
                        <IconButton onClick={() => handleAddToCart(true)}>
                            +
                        </IconButton>
                    </Box>
                </Box>

                {cart?.items && getCartItemCount() > 0 ? (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>{setCartToLocalStorage(cart); setOrdersModalOpen(true)}}
                        sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, borderRadius: 20, height: '50px' }}
                    >
                        Go to Orders
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddToCart()}
                        sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, borderRadius: 20, height: '50px' }}
                    >
                        Add to Order
                    </Button>
                )}
            </Box>



            <Dialog
                open={confirmationOpen}
                onClose={() => setConfirmationOpen(false)}
            >
                <DialogTitle>Clear Cart?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to clear the cart and add items from this new store?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationOpen(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirmClearCart} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default ItemDetailModal;


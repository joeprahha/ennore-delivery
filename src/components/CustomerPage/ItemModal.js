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
import { getCartFromLocalStorage, setCartToLocalStorage } from '../../utils/localStorage';
import OrdersModal from './ordersModal'; // Import the Orders modal
import {GoToOrdersButton} from './GoToOrdersButton'

const SlideTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ItemDetailModal = ({ open, onClose, item, storeInfo ,cart,setCart}) => {

    const [ordersModalOpen, setOrdersModalOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        if (cart?.items?.length) {
            setCartToLocalStorage(cart);
        }
    }, [cart]);

    const getCartItemCount = () => {
        const existingItem = cart?.items?.find(cartItem => cartItem.name === item.name);
        return existingItem ? existingItem.count : quantity;
    };

    const isAlreadyInCart = () => {
        return cart?.items?.some(cartItem => cartItem.name === item.name);
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
            cart.items?.length ? setCart({
                ...cart,
                items: [...cart.items, { ...item, storeId: storeInfo._id, storeName: storeInfo.name, count: newQuantity }],
            }) :
            setCart({
                ...cart,
                storeId: storeInfo._id,
                storeName: storeInfo.name,
                items: [{ ...item, storeId: storeInfo._id, storeName: storeInfo.name, count: newQuantity }],
            });
        }
    };

    const handleAddToCart = (fromInc=false) => {
        if ((cart.storeId && cart.storeId !== storeInfo._id) || !cart.items?.length) {
            setConfirmationOpen(true); // Open the confirmation dialog
        } else {
            updateCartQuantity(fromInc ? getCartItemCount()+1:getCartItemCount());
        }
    };

    const handleConfirmClearCart = () => {
        setCart({
            storeId: storeInfo._id,
                storeName: storeInfo.name,
            items: [{ ...item, count: quantity }],
        });
        setConfirmationOpen(false); // Close the confirmation dialog
    };

    const handleGoToOrders = () => {
        setOrdersModalOpen(true);
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={SlideTransition} // Add slide transition here
        >
            <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">{item.name}</Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Box
                    component="img"
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzW4EUZFweH3nNXHU6USz5v0ys6cK0a5xn7w&s`}
                    alt={item.name}
                    sx={{
                        width: '100%',
                        height: '40%',
                        objectFit: 'cover',
                    }}
                />

                <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: '8px' }}>
                    <Typography variant="h5">{item.name}</Typography>
                    <Typography variant="h6" color="textSecondary">
                        Rs. {item.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {'dfaeaf kadnfdnkfdsjdanfkjds v v jasd vkjd nvjasnd v knflk'}
                    </Typography>

                    {/* Quantity Selector and Cart Adjustment */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <IconButton
                            onClick={() => updateCartQuantity(Math.max(getCartItemCount() - 1, 0))}
                        >
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

                {isAlreadyInCart() ? (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleGoToOrders}
                        sx={{
                           position: 'absolute',
                            bottom: 16,
                            left: 16,
                            right: 16,
                            height: '50px',
                             bottom: 16,
			borderRadius: 20,
			fontSize: '1rem',
			px: 2,
                        }}
                    >
                        Go to Orders
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddToCart(item)}
                        sx={{
                           position: 'absolute',
                            bottom: 16,
                            left: 16,
                            right: 16,
                            height: '50px',
                             bottom: 16,
			borderRadius: 20,
			fontSize: '1rem',
			px: 2,
                        }}
                    >
                        Add to Order
                    </Button>
                )}
            </Box>

            {/* Render the Orders Modal */}
            <OrdersModal
                open={ordersModalOpen}
                onClose={() => setOrdersModalOpen(false)}
                cart={cart}
                storeName={storeInfo?.name}
            />

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmationOpen}
                onClose={() => setConfirmationOpen(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Clear Cart?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        You have items from another store in your cart. Do you want to clear the cart and add items from this new store?
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


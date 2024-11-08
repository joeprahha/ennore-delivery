import React from 'react';
import {
    ListItem,
    ListItemAvatar,
    ListItemText,
    Box,
    Divider,
} from '@mui/material';

const ItemList = ({  handleItemClick,items }) => {
    return (
       items.map((item)=> <React.Fragment key={item.id}>
            <ListItem
                button={item.available}
                onClick={item.available ? () => handleItemClick(item) : null}
                sx={{ opacity: item.available ? 1 : 0.5 }}
            >
                <ListItemAvatar>
                    <Box
                        sx={{
                            width: '70px',
                            height: '50px',
                            mr: 1,
                            overflow: 'hidden',
                            borderRadius: '2px',
                        }}
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover', // Ensures the image covers the box while maintaining aspect ratio
                                borderRadius: '2px', // Rounds the corners
                            }}
                        />
                    </Box>
                </ListItemAvatar>
                <ListItemText
                    primary={item.name}
                    secondary={`Rs.${item.price}`}
                />
            </ListItem>
        </React.Fragment>)
    );
};

export default ItemList;


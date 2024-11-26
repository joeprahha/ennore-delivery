import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { Box, Table, FormControl, Select, InputLabel, MenuItem, TableBody, SwipeableDrawer,TableCell, TableContainer, TableHead, TableRow, CircularProgress, Typography, Chip, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Import Search icon
import DeleteIcon from '@mui/icons-material/Delete';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedScope, setSelectedScope] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
	
    const scopes = ['customer', 'owner', 'deliveryPartner', 'god'];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/all-users');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user => {
            const matchesScope = selectedScope ? user.scope === selectedScope : true;
            const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesScope && matchesSearch;
        });
        setFilteredUsers(filtered);
    }, [selectedScope, searchTerm, users]);

    const handleScopeChange = async (userId, newScope) => {
        setIsUpdating(true);
        try {
            await api.put(`/users/${userId}/scope`, { scope: newScope });
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, scope: newScope } : user
                )
            );
            setIsUpdating(false);
        } catch (error) {
            setError('Failed to update scope');
            setIsUpdating(false);
        }
    };
const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        try {
                        const response = await api.delete(`users/${userId}`);

            if (response.status === 200) {


            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user');
        }
    }
};

    const handleScopeFilter = (scope) => {
        setSelectedScope(scope);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
     }

    // Count users by scope
    const userCountByScope = scopes.reduce((acc, scope) => {
        acc[scope] = users.filter(user => user.scope === scope).length;
        return acc;
    }, {});
    
     const handleRowClick = (order) => {
    const a=order
    a.items= JSON.parse(order?.items||'{}')
    setSelectedOrder(a); // Set the selected order
    
    setDrawerOpen(true); // Open the drawer
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false); // Close the drawer
    setSelectedOrder(null); // Clear the selected order
  }; 

    return (
        <Box sx={{ padding: 1, overflowX: 'hidden' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search by email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Chip 
                    label={`All (${users.length})`} 
                    onClick={() => handleScopeFilter('')} 
                    color={selectedScope === '' ? 'primary' : 'default'} 
                    sx={{  fontSize: '0.55rem',p:0}}
                />
                {scopes.map(scope => (
                    <Chip 
                        key={scope} 
                        label={`${scope.charAt(0).toUpperCase() + scope.slice(1)} (${userCountByScope[scope]})`} 
                        onClick={() => handleScopeFilter(scope)} 
                        color={selectedScope === scope ? 'primary' : 'default'} 
                        sx={{  fontSize: '0.55rem', overflow: 'hidden', textOverflow: 'ellipsis' }} 
                    />
                ))}
            </Box>

            <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ height: 30 }}>Email</TableCell>
                            <TableCell sx={{ height: 30 }}>Scope</TableCell>
                             <TableCell sx={{ height: 30 }}>Action</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user._id} sx={{ height: 30 }}>
                                <TableCell sx={{ height: 30 }} onClick={(e)=>handleRowClick(user)}>
                                    <Typography sx={{ fontSize: '0.75rem' }}>{user.email}</Typography>
                                </TableCell>
                                <TableCell sx={{ height: 30 }}>
                                    <FormControl fullWidth variant="outlined" size="small" sx={{ height: 20 }}>
                                        <Select
                                            value={user.scope || ''}
                                            onChange={(e) => handleScopeChange(user._id, e.target.value)}
                                            disabled={isUpdating}
                                            sx={{ height: 20, display: 'flex', alignItems: 'center', fontSize: '0.65rem' }}
                                        >
                                            {scopes.map((scope) => (
                                                <MenuItem key={scope} value={scope} sx={{ fontSize: '0.65rem' }}>
                                                    {scope}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>
<TableCell
    sx={{ height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    onClick={() => handleDelete(user._id)}
>
    <DeleteIcon sx={{ color: 'red' }} />
</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleDrawerClose}
        onOpen={() => {}}
      >
        <Box sx={{ p: 2, maxHeight: "auto", overflowY: "auto" }}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <pre style={{ fontSize: "0.9rem", wordWrap: "break-word" }}>
            {
            
            JSON.stringify(selectedOrder, null, 2)}
          </pre>
        </Box>
      </SwipeableDrawer>  
            
        </Box>
    );
};

export default Users;


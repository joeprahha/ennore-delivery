import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { Box, Table, FormControl, Select, InputLabel, MenuItem, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Typography, Chip, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Import Search icon

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedScope, setSelectedScope] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user._id} sx={{ height: 30 }}>
                                <TableCell sx={{ height: 30 }}>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Users;


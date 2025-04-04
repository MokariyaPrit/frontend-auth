import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  useMediaQuery,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridRowModes,
  GridRowId,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  organization_name: string;
  role: string;
}

interface ConfirmDialogState {
  open: boolean;
  action: "save" | "delete" | null;
  id: GridRowId | null;
  title: string;
  content: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
} as const;

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [originalRows, setOriginalRows] = useState<Record<string, User>>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    action: null,
    id: null,
    title: "",
    content: "",
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const userEmail = sessionStorage.getItem("userEmail");
      if (!userEmail) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/user/role?email=${userEmail}`);
        const data = await response.json();
        if (!response.ok || data.role !== "Admin") {
          navigate("/homepage");
        }
      } catch {
        navigate("/homepage");
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/user/all");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.map((user: User, index: number) => ({
            ...user,
            id: user.id || index.toString(),
          })));
        } else {
          throw new Error(data.message || "Failed to fetch users");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        showSnackbar("Failed to fetch users", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Utility functions
  const showSnackbar = useCallback((message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const getUserById = useCallback((id: GridRowId) => users.find((user) => user.id === id), [users]);

  // Action handlers
  const handleEditClick = useCallback((id: GridRowId) => {
    const user = getUserById(id);
    if (user) {
      setOriginalRows((prev) => ({ ...prev, [id]: user }));
      setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.Edit } }));
    }
  }, [getUserById]);

  const handleSaveConfirm = useCallback((id: GridRowId) => {
    const user = getUserById(id);
    if (user) {
      setConfirmDialog({
        open: true,
        action: "save",
        id,
        title: "Confirm Save",
        content: `Are you sure you want to save changes to ${user.first_name} ${user.last_name}?`,
      });
    }
  }, [getUserById]);

  const handleDeleteConfirm = useCallback((id: GridRowId) => {
    const user = getUserById(id);
    if (user) {
      setConfirmDialog({
        open: true,
        action: "delete",
        id,
        title: "Confirm Delete",
        content: `Are you sure you want to delete ${user.email}? This action cannot be undone.`,
      });
    }
  }, [getUserById]);

  const handleCancelClick = useCallback((id: GridRowId) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? originalRows[id] : user)));
    setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.View } }));
  }, [originalRows]);

  // API operations
  const saveUser = useCallback(async (id: GridRowId) => {
    const user = getUserById(id);
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:3000/user/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update user");
      }

      setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.View } }));
      showSnackbar("User updated successfully", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      showSnackbar("Failed to update user", "error");
    }
  }, [getUserById, showSnackbar]);

  const deleteUser = useCallback(async (id: GridRowId) => {
    try {
      const response = await fetch(`http://localhost:3000/user/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((user) => user.id !== id));
      showSnackbar("User deleted successfully", "success");
    } catch (err) {
      setError("Something went wrong");
      showSnackbar("Failed to delete user", "error");
    }
  }, [showSnackbar]);

  // Dialog handlers
  const handleConfirmDialogClose = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  }, []);

  const handleConfirmAction = useCallback(async () => {
    const { action, id } = confirmDialog;
    if (!id) return;

    if (action === "save") await saveUser(id);
    else if (action === "delete") await deleteUser(id);
    
    handleConfirmDialogClose();
  }, [confirmDialog, saveUser, deleteUser, handleConfirmDialogClose]);

  // Role rendering
  const getRoleIcon = useCallback((role: string) => {
    switch (role.toLowerCase()) {
      case ROLES.ADMIN: return <AdminPanelSettingsIcon color="primary" />;
      case ROLES.MANAGER: return <SupervisorAccountIcon color="secondary" />;
      default: return <PersonIcon />;
    }
  }, []);

  const getRoleChip = useCallback((role: string) => {
    const roleLower = role.toLowerCase();
    const color = {
      [ROLES.ADMIN]: "primary",
      [ROLES.MANAGER]: "secondary",
      [ROLES.USER]: "info",
    }[roleLower] || "default";

    return (
      <Chip
        icon={getRoleIcon(role)}
        label={role}
        color={color as "primary" | "secondary" | "info" | "default"}
        size="small"
        variant="outlined"
      />
    );
  }, [getRoleIcon]);


  // Grid columns
  const columns: GridColDef[] = [
    { field: "first_name", headerName: "First Name", width: isSmallScreen ? 120 : 150, editable: true, flex: isMediumScreen ? 0 : 1 },
    { field: "last_name", headerName: "Last Name", width: isSmallScreen ? 120 : 150, editable: true, flex: isMediumScreen ? 0 : 1 },
    { field: "email", headerName: "Email", width: isSmallScreen ? 180 : 200, editable: true, flex: isMediumScreen ? 0 : 1.5 },
    { field: "mobile_no", headerName: "Mobile Number", width: isSmallScreen ? 130 : 150, editable: true, flex: isMediumScreen ? 0 : 1 },
    { field: "role", headerName: "Role", width: isSmallScreen ? 100 : 120, editable: true, flex: isMediumScreen ? 0 : 0.8, renderCell: (params) => getRoleChip(params.value as string) },
    {
      field: "actions",
  
      headerName: "Actions",
      width: isSmallScreen ? 120 : 150,
      flex: isMediumScreen ? 0 : 0.8,
      renderCell: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        return (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center",  }}>
            {isInEditMode ? (
              <>
                <Tooltip title="Save">
                  <IconButton onClick={() => handleSaveConfirm(id)} color="primary" size="small">
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton onClick={() => handleCancelClick(id)} size="small">
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEditClick(id)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDeleteConfirm(id)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        );
      },
    },
  ];

  const dataGridStyles = {
    "& .MuiDataGrid-root": {
      border: "none",
    },
    "& .MuiDataGrid-cell": {
      borderBottom: `1px solid ${theme.palette.divider}`,
      color: theme.palette.text.primary,
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: "bold",
      color: "#000", // Ensuring header title color is black
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: theme.palette.background.default,
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: theme.palette.background.paper,
    },
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ bgcolor: "background.default", borderRadius: 2, minHeight: "100vh" }}>
        <Box sx={{ mb: 4, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all users and their details
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400, bgcolor: "background.paper", borderRadius: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <DataGrid
              rows={users}
              columns={columns}
              autoHeight
              pagination
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={setRowModesModel}
              disableRowSelectionOnClick
              processRowUpdate={(updatedRow) => {
                setUsers((prev) => prev.map((user) => (user.id === updatedRow.id ? updatedRow : user)));
                return updatedRow;
              }}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[5, 10, 25]}
              sx={dataGridStyles}
            />
          </Paper>
        )}

        <Dialog open={confirmDialog.open} onClose={handleConfirmDialogClose}>
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{confirmDialog.content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmDialogClose}>No</Button>
            <Button onClick={handleConfirmAction} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default AdminPage;
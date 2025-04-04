import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { 
  DataGrid, GridColDef, GridRowModesModel, 
  GridRowModes, GridRowId 
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  organization_name: string;
  role: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [originalRows, setOriginalRows] = useState<Record<string, User>>({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const checkAdmin = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/role?email=${userEmail}`);
        const data = await response.json();
        if (!response.ok || data.role !== "admin") {
          navigate("/homepage");
        }
      } catch (err) {
        navigate("/homepage");
      }
    };
    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/all");
        const data = await response.json();
        if (response.ok) {
          const usersWithIds = data.map((user: User, index: number) => ({
            ...user,
            id: user.id || index.toString(),
          }));
          setUsers(usersWithIds);
        } else {
          setError(data.message || "Failed to fetch users.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    };
    fetchUsers();
  }, []);
  
  /** Enable edit mode and store original row */
  const handleEditClick = (id: GridRowId) => () => {
    setOriginalRows((prev) => ({ ...prev, [id]: users.find((user) => user.id === id)! }));
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  /** Save changes */
  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  /** Cancel edit and revert changes */
  const handleCancelClick = (id: GridRowId) => () => {
    setUsers(users.map((user) => (user.id === id ? originalRows[id] : user)));
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  /** Delete a user */
  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        setError("Failed to delete user.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };


  const columns: GridColDef[] = [
    { field: "first_name", headerName: "First Name", width: 150, editable: true },
    { field: "last_name", headerName: "Last Name", width: 150, editable: true },
    { field: "email", headerName: "Email", width: 200, editable: true },
    { field: "mobile_no", headerName: "Mobile Number", width: 150, editable: true },
    { field: "role", headerName: "Role", width: 100, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 150, // Increase width if needed
      renderCell: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        return (
          <>
            {isInEditMode ? (
              <>
                <IconButton onClick={handleSaveClick(id)} color="primary">
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={handleCancelClick(id)}>
                  <CancelIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={handleEditClick(id)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDeleteClick(id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </>
        );
      },
    },
  ];
  

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Manage all users and their details
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
    <Box sx={{ width: "100%", overflowX: "auto" }}>
  <DataGrid
    rows={users}
    columns={columns}
    autoPageSize
    editMode="row"
    rowModesModel={rowModesModel}
    onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
    disableRowSelectionOnClick
  />
</Box>

    </Box>
  );
}

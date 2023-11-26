import { useEffect } from 'react';
import { IconButton, Box, Paper } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import NoteCardIcon from '@mui/icons-material/NoteAdd';
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

const ShowCNotices = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { noticesList, loading, error, response } = useSelector((state) => state.notice);
  const { currentUser } = useSelector(state => state.user)

  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllNotices(adminID, "Notice"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address))
      .then(() => {
        dispatch(getAllNotices(adminID, "Notice"));
      })
  }

  const NoticesColumns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'details', label: 'Details', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
    
  ]

  const NoticesRows = noticesList && noticesList.length > 0 && noticesList.map((notice) => {
    const date = new Date(notice.date);
    const dateString = date.toString() !== "Invalid Date"? date.toISOString().substring(0, 10): "Invalid Date";
    return {
        title: notice.title,
        details: notice.details,
        date: dateString,
        id: notice._id,
      
    };
  })

  const NoticesButtonHaver = ({ row }) => {
    return (
        <IconButton onClick={() => deleteHandler(row.id, "Notices")} color="secondary">
          <DeleteIcon color="error" />
        </IconButton>
    );
  };
  const actions = [
    {
      icon: <NoteCardIcon color="primary" />, name: 'Add New Notice',
      action: () => navigate("/Admin/addnotice")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Notices',
      action: () => deleteHandler(adminID, "Notices")
    },
  ];
  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {response ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton variant="contained" onClick={() => navigate("/Admin/addnotice")}>
                Add Notice
              </GreenButton>
            </Box>
            :
            <Paper sx={{width: '100%', overflow:'hidden'}}>
              {Array.isArray(noticesList) && noticesList.length > 0 &&
                <TableTemplate buttonHaver={NoticesButtonHaver} columns={NoticesColumns} rows={NoticesRows} />
              }
              <SpeedDialTemplate actions={actions} />
            </Paper>}
        </>
      }
    </>
  );
};

export default ShowCNotices;

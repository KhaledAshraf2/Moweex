import React, { useState } from 'react';
import { Box, Button, makeStyles, Snackbar } from '@material-ui/core';
import UserModal from './components/UserModal/UserModal';
import UserTable from './components/UserTable/UserTable';
import { Alert } from '@material-ui/lab';

export interface FinishMessage {
  error: string;
  success: string;
}

const useStyles = makeStyles({
  addUserButton: {
    backgroundColor: 'orange',
    '&:hover': {
      backgroundColor: 'orangered',
    },
  },
});

const App = () => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [finishMessage, setFinishMessage] = useState<FinishMessage>({
    error: '',
    success: '',
  });
  return (
    <Box p={6}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          className={classes.addUserButton}
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}>
          Add User
        </Button>
      </Box>
      <UserModal
        open={open}
        setOpen={setOpen}
        setRefresh={setRefresh}
        setFinishMessage={setFinishMessage}
      />
      <UserTable
        refresh={refresh}
        setRefresh={setRefresh}
        setFinishMessage={setFinishMessage}
      />
      <Snackbar
        open={finishMessage.error !== '' || finishMessage.success !== ''}
        autoHideDuration={3000}
        onClose={() => setFinishMessage({ error: '', success: '' })}>
        <Alert
          onClose={() => setFinishMessage({ error: '', success: '' })}
          severity={finishMessage.error !== '' ? 'error' : 'success'}>
          {finishMessage.error !== ''
            ? finishMessage.error
            : finishMessage.success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;

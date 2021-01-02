import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  DialogActions,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DoneIcon from '@material-ui/icons/Done';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import { FinishMessage } from '../../App';
import { Data } from '../UserTable/UserTable';
import './UserModal.css';
interface UserModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setRefresh: Dispatch<SetStateAction<number>>;
  setFinishMessage: Dispatch<SetStateAction<FinishMessage>>;
  user?: Data;
}

const useStyles = makeStyles({
  dialogPaper: {
    width: '40%',
  },

  nameInputs: {
    display: 'flex',
    justifyContent: 'space-between',
    columnGap: '10%',
  },
  outlinedOrangeButton: {
    color: 'orange',
    borderColor: 'orange',
    '&:hover': {
      borderColor: 'orange',
    },
  },
  orangeButton: {
    backgroundColor: 'orange',
    '&:hover': {
      backgroundColor: 'orangered',
    },
  },
  backdrop: {
    zIndex: 1,
  },
  textField: {
    '& label.Mui-focused': {
      color: 'orange',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'orange',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'orange',
      },
      '&:hover fieldset': {
        borderColor: 'orange',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'orange',
      },
    },
  },
});
const UserModal: React.FC<UserModalProps> = ({
  open,
  setOpen,
  setRefresh,
  setFinishMessage,
  user,
}) => {
  interface ErrorText {
    firstName?: string;
    lastName?: string;
    email?: string;
  }
  const classes = useStyles();
  const [firstName, setFirstName] = useState<string>(
    user ? user.firstName : '',
  );
  const [lastName, setlastName] = useState<string>(user ? user.lastName : '');
  const [email, setEmail] = useState<string>(user ? user.email : '');
  const [birthdate, setBirthdate] = useState<Date | null>(
    user && user.birthdate ? new Date(user.birthdate) : null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  console.log(user);
  const [errorText, setErrorText] = useState<ErrorText>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [openDate, setOpenDate] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };

  const validateEmail = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  };
  const reset = () => {
    setFirstName('');
    setlastName('');
    setEmail('');
    setBirthdate(null);
  };
  const onSubmit = async () => {
    const emailValidation = validateEmail()
      ? ''
      : 'Please Enter A Correct Email';
    setErrorText((prevError) => ({
      ...prevError,
      firstName: firstName === '' ? 'Please Enter your First Name' : '',
      lastName: lastName === '' ? 'Please Enter your Last Name' : '',
      email: email === '' ? 'Please Enter your Email' : emailValidation,
    }));
    if (
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      emailValidation === ''
    ) {
      const body = {
        firstName,
        lastName,
        email,
        birthdate,
      };
      reset();
      setLoading(true);
      try {
        if (user) {
          await axios.patch(`http://localhost:3005/user/${user._id}`, {
            updatedUser: body,
          });
          setFinishMessage((prevState) => ({
            ...prevState,
            success: 'The User Info Succesfully Updated!',
          }));
        } else {
          await axios.post('http://localhost:3005/user', body);
          setFinishMessage((prevState) => ({
            ...prevState,
            success: 'The User Succesfully Created!',
          }));
        }
        setRefresh((prev) => prev + 1);
      } catch (e) {
        setFinishMessage((prevState) => ({
          ...prevState,
          error: 'Something Went Wrong, Please Try Again Later!',
        }));
      }
      setLoading(false);
      handleClose();
    }
  };
  return (
    <>
      <Dialog
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        PaperProps={{ className: `${classes.dialogPaper}` }}>
        <Box minWidth="50%">
          <DialogTitle>{user ? 'Edit User' : 'New User'}</DialogTitle>
          <DialogContent>
            {/* As you told me not to use the Grid Components of Material-ui 
            and to use my own classes using CSS Only */}
            <Box
              className="grid-list"
              display="flex"
              gridColumnGap={'3vw'}
              gridRowGap={'3vw'}>
              <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
              <TextField
                InputLabelProps={{
                  style: {
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '100%',
                  },
                }}
                required
                fullWidth
                value={firstName}
                error={errorText['firstName'] !== ''}
                onChange={(e) => setFirstName(e.target.value)}
                classes={{ root: classes.textField }}
                autoFocus
                label="First Name"
                type="firstname"
                helperText={errorText === null ? '' : errorText['firstName']}
              />
              <TextField
                required
                InputLabelProps={{
                  style: {
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '100%',
                  },
                }}
                fullWidth
                value={lastName}
                error={errorText['lastName'] !== ''}
                onChange={(e) => setlastName(e.target.value)}
                classes={{ root: classes.textField }}
                label="Last Name"
                type="lastname"
                helperText={errorText === null ? '' : errorText['lastName']}
              />
            </Box>

            <TextField
              required
              InputLabelProps={{
                style: {
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  width: '100%',
                },
              }}
              value={email}
              error={errorText['email'] !== ''}
              classes={{ root: classes.textField }}
              onChange={(e) => setEmail(e.target.value)}
              margin="dense"
              label="Email Address"
              type="email"
              helperText={errorText === null ? '' : errorText['email']}
              fullWidth
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                InputLabelProps={{
                  style: {
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '100%',
                  },
                }}
                fullWidth
                clearable
                className={classes.textField}
                margin="normal"
                label="Birthdate"
                format="dd/MM/yyyy"
                value={birthdate}
                open={openDate}
                onClose={() => {
                  setOpenDate(false);
                }}
                onChange={(date) => {
                  setBirthdate(date);
                }}
                onClick={() => {
                  setOpenDate(true);
                }}
              />
            </MuiPickersUtilsProvider>
          </DialogContent>
          <DialogActions>
            {/* As you told me not to use the Grid Components of Material-ui 
            and to use my own classes using CSS Only */}
            <Box
              width="100%"
              className="grid-list"
              display="flex"
              gridColumnGap="1vw"
              gridRowGap="1vw"
              justifyContent="flex-end">
              <Button
                className={classes.outlinedOrangeButton}
                onClick={handleClose}
                variant="outlined"
                color="primary">
                Cancel
              </Button>
              <Button
                className={classes.orangeButton}
                startIcon={<DoneIcon />}
                onClick={onSubmit}
                variant="contained"
                color="primary">
                Submit
              </Button>
            </Box>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default UserModal;

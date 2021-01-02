import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from './EnhancedTableHead';
import Pagination from './Pagination';
import { useState } from 'react';
import axios from 'axios';
import { Backdrop, Box, Button, CircularProgress } from '@material-ui/core';
import { FinishMessage } from '../../App';
import UserModal from '../UserModal/UserModal';

export interface Data {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: string | null;
  createdAt: string;
}

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);
const useStyles = makeStyles({
  orangeButton: {
    color: 'white',
    backgroundColor: 'orange',
    '&:hover': {
      backgroundColor: 'orangered',
    },
  },
});
export type Order = 'asc' | 'desc';

const preprocessDate = (date: string | null) => {
  if (date === null) {
    return '---';
  }
  const newDate = new Date(date);

  return `${newDate.getDate()}/${
    newDate.getMonth() + 1
  }/${newDate.getFullYear()}`;
};

interface UserTableProps {
  refresh: number;
  setRefresh: Dispatch<SetStateAction<number>>;
  setFinishMessage: Dispatch<SetStateAction<FinishMessage>>;
}

export interface Filters {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthdate?: string;
  createdAt?: string;
}
const UserTable = ({
  refresh,
  setRefresh,
  setFinishMessage,
}: UserTableProps) => {
  const classes = useStyles();
  const [rows, setRows] = useState<Data[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('firstName');
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({});

  const [userIndex, setUserIndex] = useState<number>(-1);
  const handleRequestSort = (key: keyof Data) => {
    const isAsc = orderBy === key && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(key);
  };
  const handleRequestFilter = (key: keyof Filters, value: string | null) => {
    console.log('HANDLE');
    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        [key]: value === null ? undefined : value,
      };
    });
  };
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const newFilters: Filters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key as keyof Filters]) {
          newFilters[key as keyof Filters] = filters[key as keyof Filters];
        }
      });
      console.log('newfiltersssss', newFilters);
      const params = {
        pageNumber: page,
        pageSize: rowsPerPage,
        order,
        orderBy,
        ...newFilters,
      };

      const res = await axios.get('http://localhost:3005/users', { params });
      setLoading(false);
      setRows(res.data.users);
      setCount(res.data.count);
    } catch (e) {
      setLoading(false);
      console.log('error', e);
    }
  }, [page, rowsPerPage, order, orderBy, filters]);
  useEffect(() => {
    fetchData();
  }, [fetchData, order, orderBy, refresh]);

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3005/user/${id}`);
      setRefresh((prev) => prev - 1);
      setFinishMessage((prevState) => ({
        ...prevState,
        success: 'The User Succesfully Deleted',
      }));
    } catch (e) {
      setFinishMessage((prevState) => ({
        ...prevState,
        error: 'Something Went Wrong, Please Try Again Later',
      }));
    }
  };
  return (
    <>
      <Paper>
        <Backdrop style={{ zIndex: 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <TableContainer component={Paper}>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              onRequestFilter={handleRequestFilter}
            />
            <TableBody>
              {rows.map((row, index) => (
                <StyledTableRow key={row._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell component="th" scope="row">
                    {row.email}
                  </TableCell>
                  <TableCell>{preprocessDate(row.birthdate)}</TableCell>
                  <TableCell>{preprocessDate(row.createdAt)}</TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gridRowGap="1vw">
                      <Box>
                        <Button
                          size="small"
                          fullWidth
                          className={classes.orangeButton}
                          onClick={() => setUserIndex(index)}
                          variant="contained">
                          Edit
                        </Button>
                      </Box>
                      <Box>
                        <Button
                          size="small"
                          fullWidth
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteUser(row._id)}>
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          rowsCount={count}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Paper>
      {userIndex >= 0 && (
        <UserModal
          open={userIndex !== -1}
          setOpen={() => setUserIndex(-1)}
          setRefresh={setRefresh}
          setFinishMessage={setFinishMessage}
          user={rows[userIndex]}
        />
      )}
    </>
  );
};
export default UserTable;

import {
  Toolbar,
  MenuItem,
  Select,
  createStyles,
  makeStyles,
  Theme,
  Box,
  IconButton,
  Typography,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import React, { Dispatch, SetStateAction } from 'react';

interface PaginationProps {
  page: number;
  rowsCount: number;
  setPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectRoot: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    toolbar: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    orangeIcon: {
      border: '1px solid orange',
      color: 'orange',
      borderRadius: '3px',
    },
    disabledIcon: {
      border: '1px solid rgba(0,0,0,0.3)',
      color: 'rgba(0,0,0,0.3)',
      borderRadius: '3px',
    },
    pageTitle: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  }),
);

const Pagination = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  rowsCount,
}: PaginationProps) => {
  const classes = useStyles();
  const rowsPerPageOptions = [10, 15, 25, 50];
  const lastPage = Math.ceil(rowsCount / rowsPerPage);

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setRowsPerPage(e.target.value as number);
  };
  return (
    <Toolbar className={classes.toolbar}>
      <Select
        classes={{ root: classes.selectRoot }}
        variant="outlined"
        value={rowsPerPage}
        onChange={handleChange}>
        {rowsPerPageOptions.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%">
        <IconButton
          size="small"
          disabled={page <= 1}
          onClick={() => {
            setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
          }}>
          <ChevronLeftIcon
            className={page > 1 ? classes.orangeIcon : classes.disabledIcon}
          />
        </IconButton>

        <Typography variant="subtitle2" className={classes.pageTitle}>
          {page} of {lastPage}
        </Typography>

        <IconButton
          disabled={page >= lastPage}
          size="small"
          onClick={() => {
            setPage((prevPage) =>
              prevPage < lastPage ? prevPage + 1 : prevPage,
            );
          }}>
          <ChevronRightIcon
            className={
              page < lastPage ? classes.orangeIcon : classes.disabledIcon
            }
          />
        </IconButton>
      </Box>
    </Toolbar>
  );
};

export default Pagination;

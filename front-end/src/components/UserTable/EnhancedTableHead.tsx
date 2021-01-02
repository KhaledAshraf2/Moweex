import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TextField,
  makeStyles,
  Box,
} from '@material-ui/core';
import React from 'react';
import { Data, Filters, Order } from './UserTable';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useState } from 'react';

const useStyles = makeStyles({
  tableCell: {
    whiteSpace: 'nowrap',
    verticalAlign: 'top',
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

interface EnhancedTableProps {
  onRequestSort: (key: keyof Data) => void;
  onRequestFilter: (key: keyof Filters, value: string | null) => void;
  order: Order;
  orderBy: string;
}
interface HeadCell {
  id: keyof Data;
  label: string;
}
const headCells: HeadCell[] = [
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'email', label: 'Email' },
  { id: 'birthdate', label: 'Birthdate' },
  { id: 'createdAt', label: 'createdAt' },
];

interface DateFilter {
  birthdate: Date | null;
  createdAt: Date | null;
}
const EnhancedTableHead = ({
  order,
  orderBy,
  onRequestSort,
  onRequestFilter,
}: EnhancedTableProps) => {
  const classes = useStyles();
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    birthdate: null,
    createdAt: null,
  });
  const [openDateDialog, setOpenDateDialog] = useState<
    'birthdate' | 'createdAt' | null
  >(null);
  const createSortHandler = (key: keyof Data) => () => {
    onRequestSort(key);
  };
  const createFilterHandler = (
    event:
      | React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
      | Date
      | null,
    key: keyof Filters,
  ) => {
    if (
      (key === 'birthdate' || key === 'createdAt') &&
      (event as Date | null)
    ) {
      (event as Date).setHours(0);
      (event as Date).setMinutes(0);
      (event as Date).setMilliseconds(0);

      onRequestFilter(key, event === null ? null : String(event));
    } else {
      onRequestFilter(
        key,
        (event as React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>)
          .target.value,
      );
    }
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.tableCell} component="th" scope="row">
          ID
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            className={classes.tableCell}
            style={{ whiteSpace: 'nowrap' }}
            key={headCell.id}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              IconComponent={KeyboardArrowUpIcon}>
              {headCell.label}
            </TableSortLabel>
            <Box>
              {headCell.id === 'birthdate' || headCell.id === 'createdAt' ? (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    clearable
                    className={classes.textField}
                    format="dd/MM/yyyy"
                    open={openDateDialog === headCell.id}
                    onClick={() =>
                      setOpenDateDialog(
                        headCell.id as 'birthdate' | 'createdAt',
                      )
                    }
                    onClose={() => setOpenDateDialog(null)}
                    value={dateFilter[headCell.id]}
                    onChange={(date) => {
                      createFilterHandler(date, headCell.id as keyof Filters);

                      setDateFilter((prevDate) => {
                        return {
                          ...prevDate,
                          [headCell.id]: date,
                        };
                      });
                    }}
                  />
                </MuiPickersUtilsProvider>
              ) : (
                <TextField
                  onBlur={(e) => {
                    createFilterHandler(e, headCell.id as keyof Filters);
                  }}></TextField>
              )}
            </Box>
          </TableCell>
        ))}
        <TableCell className={classes.tableCell} align="center">
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;

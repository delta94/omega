import React, {useEffect, useState} from "react";
import XTable from "../../../components/table/XTable";
import {XHeadCell} from "../../../components/table/XTableHead";
import Grid from '@material-ui/core/Grid';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import {recentLoansHeadCells} from "./config";
import {AppState} from "../../../data/types";
import {ILoanState, loanConstants} from "../../../data/redux/loans/reducer";
import {ILoanFilter} from "../types";
import {search} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import TableLoading from "../../../components/loaders/TableLoading";

const headCells: XHeadCell[] = [...recentLoansHeadCells];

const RecentLoansList = () => {
    const dispatch = useDispatch();
    const {recent}: ILoanState = useSelector((state: AppState) => state.loans)
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const filter: ILoanFilter = {
            showAssigned: false,
            showNew: true,
        }
        setLoading(true)
        search(remoteRoutes.loans, filter, resp => {
            dispatch({
                type: loanConstants.loanFetchRecent,
                payload: [...resp],
            })
        }, undefined, () => {
            setLoading(false)
        })
    }, [dispatch])
    return (
        <Box p={1} width='100%'>
            <Box pb={2}>
                <Typography variant='h5'>New Loans</Typography>
            </Box>
            {
                loading ? <TableLoading rows={4}/>  :
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <XTable
                                headCells={headCells}
                                data={recent}
                                initialRowsPerPage={3}
                                usePagination={false}
                            />
                        </Grid>
                    </Grid>
            }
        </Box>
    );
}

export default RecentLoansList

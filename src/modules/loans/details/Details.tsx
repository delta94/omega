import React, {useEffect, useState} from 'react';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import {getRouteParam} from "../../../utils/routHelpers";
import {useDispatch, useSelector} from "react-redux";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {IState} from "../../../data/types";
import {fakeLoan, ILoan} from "../types";
import {loanConstants} from "../../../data/redux/loans/reducer";
import Layout from "../../../components/layout/Layout";
import Box from "@material-ui/core/Box";
import {RouteComponentProps, withRouter} from "react-router";
import PersonalInformation from "./PersonalInformation";
import Loading from "../../../components/Loading";
import Grid from "@material-ui/core/Grid";
import {trimGuid} from "../../../utils/stringHelpers";
import {renderStatus, renderSubStatus} from "../list/config";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Summary from "./Summary";
import {fakeContact} from "../../contacts/types";
import SoreCard from "./ScoreCard";
import LoanApplication from "./LoanApplication";
import LoanRequest from "./LoanRequest";
import PreviousLoans from './PreviousLoans';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            padding: 0,
            backgroundColor: 'transparent'
        },
        paperStyle: {
            borderRadius: 0
        }

    }),
);

/*

- Loan Application
- Agent Details
- Personal information
- Financial Data (Income)
- Outstanding loans
- Applicant( Status and Notifications)
 */


const Details = (props: RouteComponentProps) => {
    const [loading, setLoading] = useState(false);
    const loanId = getRouteParam(props, 'loanId')
    const classes = useStyles()
    const dispatch = useDispatch();
    const data: ILoan | undefined = useSelector((state: IState) => state.loans.selected)

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            const data = fakeLoan()
            data.applicant = fakeContact()
            dispatch({
                type: loanConstants.loanFetchOne,
                payload: data,
            })
            setLoading(false)
        }, 500)
    }, [dispatch])

    if (!data)
        return (
            <Layout>
                <Loading/>
            </Layout>
        );
    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper elevation={0} className={classes.paperStyle}>
                        <Box p={2}>
                            <Typography variant='h5'>Loan Details: {trimGuid(data.id)}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Paper elevation={0} className={classes.paperStyle}>
                        <Box p={1} mb={1}>
                            <Typography
                                variant='h6' style={{fontSize: '1.0rem'}}>
                                Status:&nbsp;
                                {renderStatus(data.status)}&nbsp;
                                {renderSubStatus(data.subStatus)}
                            </Typography>
                        </Box>
                    </Paper>
                    <Stepper orientation="vertical" className={classes.root}>
                        <LoanApplication data={data}/>
                        <PersonalInformation data={data}/>
                        <LoanRequest data={data}/>
                        <SoreCard data={data}/>
                        <PreviousLoans data={data}/>
                    </Stepper>
                </Grid>
                <Grid item xs={4}>
                    <Paper elevation={0} className={classes.paperStyle}>
                        <Box p={1}>
                            <Typography variant='h6' style={{fontSize: '1.0rem'}}>Loan summary</Typography>
                        </Box>
                        <Divider/>
                        <Box p={2}>
                            <Summary data={data}/>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default withRouter(Details);

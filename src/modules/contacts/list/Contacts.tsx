import React, {useEffect, useState} from "react";
import Layout from "../../../components/layout/Layout";
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {getEmail, getNin, getPhone, IContactsFilter, renderName} from "../types";
import XTable from "../../../components/table/XTable";
import {XHeadCell} from "../../../components/table/XTableHead";
import Grid from '@material-ui/core/Grid';
import Filter from "./Filter";
import ContactLink from "../../../components/ContactLink";
import {search} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import Loading from "../../../components/Loading";
import Box from "@material-ui/core/Box";
import EditDialog from "../../../components/EditDialog";
import NewPersonForm from "../forms/NewPersonForm";
import AddIcon from "@material-ui/icons/Add";
import UploadIcon from "@material-ui/icons/CloudUpload";
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import {crmConstants, ICrmState} from "../../../data/contacts/reducer";
import Button from "@material-ui/core/Button";
import RecentContacts from "./RecentContacts";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        filterPaper: {
            borderRadius: 0,
            padding: theme.spacing(2)
        },
        fab: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    }),
);

const headCells: XHeadCell[] = [
    {name: 'id', label: 'Name', render: (value, rec) => <ContactLink id={value} name={renderName(rec)}/>},
    {name: 'category', label: 'Category'},
    {name: 'tin', label: 'TIN/NIN', render: (_, rec) => getNin(rec)},
    {name: 'email', label: 'Email', render: (_, rec) => getEmail(rec)},
    {name: 'phone', label: 'Phone', render: (_, rec) => getPhone(rec)},

];

const Contacts = () => {
    const dispatch = useDispatch();
    const [createDialog, setCreateDialog] = useState(false);
    const {data, loading}: ICrmState = useSelector((state: any) => state.crm)

    const [filter, setFilter] = useState<IContactsFilter>({});
    const classes = useStyles();

    useEffect(() => {
        dispatch({
            type: crmConstants.crmFetchLoading,
            payload: true,
        })
        search(
            remoteRoutes.contacts,
            filter,
            (resp) => {
                dispatch({
                    type: crmConstants.crmFetchAll,
                    payload: [...resp],
                })
            },
            undefined,
            () => {
                dispatch({
                    type: crmConstants.crmFetchLoading,
                    payload: false,
                })
            })
    }, [filter, dispatch])


    function handleFilter(value: any) {
        setFilter({...filter, ...value})
    }

    function handleNew() {
        setCreateDialog(true)
    }

    function closeCreateDialog() {
        setCreateDialog(false)
    }

    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <RecentContacts/>
                    <Box p={1} className={classes.root}>
                        <Box pb={2}>
                            <Grid container>
                                <Grid item sm={6}>
                                    <Typography variant='h5'>Contacts</Typography>
                                </Grid>
                                <Grid item sm={6}>
                                    <Box display='flex' flexDirection="row-reverse">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<AddIcon/>}
                                            onClick={handleNew}
                                            style={{marginLeft: 8}}
                                        >
                                            New&nbsp;&nbsp;
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<UploadIcon/>}
                                            //onClick={onAddNew}
                                            style={{marginLeft: 8}}
                                        >
                                            Upload&nbsp;&nbsp;
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        {
                            loading ? <Loading/> :
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <XTable
                                            headCells={headCells}
                                            data={data}
                                            initialRowsPerPage={10}
                                        />
                                    </Grid>
                                </Grid>
                        }
                    </Box>
                </Grid>
                <Grid item xs={3} >
                    <Box pb={2}>
                        <Typography variant='h5'>&nbsp;</Typography>
                    </Box>
                    <Box pt={1}>
                        <Paper className={classes.filterPaper} elevation={0}>
                            <Filter onFilter={handleFilter} loading={loading}/>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
            <EditDialog title="New Person" open={createDialog} onClose={closeCreateDialog}>
                <NewPersonForm data={{}} done={closeCreateDialog}/>
            </EditDialog>
        </Layout>
    );
}

export default Contacts
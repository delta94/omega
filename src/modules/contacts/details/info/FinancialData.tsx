import React, {useState} from 'react';
import {IContact} from "../../types";
import DetailView, {IRec} from "../../../../components/DetailView";
import {printDate} from "../../../../utils/dateHelpers";
import MoneyIcon from '@material-ui/icons/Money';
import EditIconButton from "../../../../components/EditIconButton";
import EditDialog from "../../../../components/EditDialog";
import PersonEditor from "../editors/PersonEditor";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";

interface IProps {
    data: IContact
}

export const idFields = (data: IContact): IRec[] => {
    const {financialData} = data
    return [
        {
            label: 'NetSalary',
            value: '3,720,000 /='
        },
        {
            label: 'Employment Date',
            value: printDate(new Date())
        }
    ]
}

const FinancialData = ({data}: IProps) => {
    const [dialog, setDialog] = useState(false)
    const {id = ''} = data

    const handleClick = () => {
        setDialog(true)
    }

    const handleClose = () => {
        setDialog(false)
    }

    const displayData = idFields(data);
    const title = <div style={{display: 'flex', flexDirection: 'row'}}>
        <MoneyIcon fontSize='small'/><Typography variant='body2'>&nbsp;<b>Financial Data</b></Typography>
    </div>
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Box display="flex" px={1}>
                    <Box flexGrow={1} pt={1}>
                        {title}
                    </Box>
                    <Box>
                        <EditIconButton onClick={handleClick}/>
                    </Box>
                </Box>
                <Divider/>
            </Grid>
            <Grid item xs={12}>
                <Box p={1}>
                    <DetailView data={displayData}/>
                </Box>
            </Grid>
            <EditDialog title='Edit Basic Data' open={dialog} onClose={handleClose}>
                <PersonEditor data={data.person} contactId={id} done={handleClose}/>
            </EditDialog>
        </Grid>
    );
}
export default FinancialData;
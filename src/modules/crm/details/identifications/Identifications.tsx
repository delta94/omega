import React, {useState} from 'react';
import {IContact, IIdentification} from "../../types";
import EditIconButton, {AddIconButton, DeleteIconButton} from "../../../../components/EditIconButton";
import ListIcon from "@material-ui/icons/List";
import EditDialog from "../../../../components/EditDialog";
import IdentificationEditor from "./IdentificationEditor";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import SectionTitle from "../info/SectionTitle";
import SectionItem, {SectionItemContent} from "../info/SectionItem";

interface IProps {
    data: IContact
}

const Identifications = ({data}: IProps) => {
    const {identifications, id = ''} = data
    const [selected, setSelected] = useState<IIdentification | null>(null)
    const [dialog, setDialog] = useState(false)


    const handleClick = (dt: IIdentification) => () => {
        setSelected(dt)
        setDialog(true)
    }

    const handleClose = () => {
        setDialog(false)
        setSelected(null)
    }

    const handleNew = () => {
        setSelected(null)
        setDialog(true)
    }


    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <SectionTitle
                    title='Identifications'
                    editButton={<AddIconButton onClick={handleNew} style={{marginTop: 5}}/>}
                    icon={<ListIcon fontSize='small'/>}
                />
                {/*<Divider/>*/}
            </Grid>
            {identifications.map(it => (
                <Grid item xs={12} key={it.id}>
                    <SectionItem buttons={
                        <Box>
                            <EditIconButton onClick={handleClick(it)}/>
                            <DeleteIconButton onClick={handleClick(it)}/>
                        </Box>
                    }>
                        <SectionItemContent value={it.value} category={it.category}/>
                    </SectionItem>
                </Grid>
            ))}
            <EditDialog title={selected ? "Edit Identification" : "New Identification"} open={dialog}
                        onClose={handleClose}>
                <IdentificationEditor data={selected} isNew={!selected} contactId={id} done={handleClose}/>
            </EditDialog>
        </Grid>
    );
}
export default Identifications;

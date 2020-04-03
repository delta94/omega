import React, {useCallback, useState} from 'react';
import EditDialog from "../../../../components/EditDialog";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {downLoad, postFile, triggerDownLoad} from "../../../../utils/ajax";
import {remoteRoutes} from "../../../../data/constants";
import Grid from "@material-ui/core/Grid";
import Loading from "../../../../components/Loading";
import Alert from '@material-ui/lab/Alert';
import {hasNoValue} from "../../../../components/inputs/inputHelpers";
import Button from "@material-ui/core/Button";
import {DropzoneArea} from 'material-ui-dropzone'
import {getRandomStr} from "../../../../utils/stringHelpers";

const fileTypes = [
    ".csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]

interface IProps {
    show: boolean
    onClose: () => any
    onDone: () => any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        zone: {
            width: 400
        },
    }),
);

const ContactUpload = ({show, onClose, onDone}: IProps) => {
    const classes = useStyles()
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [files, setFiles] = useState<any[] | null>(null)

    const onDrop = useCallback((files: any[]) => {
        if (hasNoValue(files)) {
            return
        }
        setFiles(files)
        setLoading(true)
        let formData = new FormData()
        formData.append('file', files[0])
        postFile(remoteRoutes.peopleUpload, formData, data => {
            setSuccess(true)
        }, undefined, () => {
            setLoading(false)
        })
    }, [])

    function handleSampleDownload() {
        downLoad(remoteRoutes.peopleSample, data => {
            triggerDownLoad(data, `file-${getRandomStr(5)}.xlsx`)
        })
    }

    return (
        <EditDialog title='Upload Contacts' open={show} onClose={onClose} disableBackdropClick>
            <Grid container spacing={1} style={{width: 400}}>
                {
                    files &&
                    <Grid item xs={12}>
                        {
                            loading ? <Loading/> :
                                <Box display='flex' justifyContent='center'>
                                    {
                                        success ?
                                            <Alert severity="success">Upload complete</Alert> :
                                            <Alert severity="error">Upload failed</Alert>
                                    }
                                </Box>
                        }
                    </Grid>
                }
                {
                    (hasNoValue(files) || !success) &&
                    <Grid item xs={12}>
                        <Box pb={2}>
                            <DropzoneArea
                                dropzoneClass={classes.zone}
                                dropzoneText='Drop excel here or click'
                                acceptedFiles={fileTypes}
                                onChange={onDrop}
                            />
                        </Box>
                    </Grid>
                }
                <Grid item xs={12}>
                    <Box p={1} pt={2}>
                        <Grid container spacing={1} alignContent='flex-end' justify='flex-end'>
                            <Grid item>
                                <Button
                                    variant='contained'
                                    color='default'
                                    onClick={handleSampleDownload}
                                    disabled={loading|| success}
                                >Get Sample</Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant='contained'
                                    color='default'
                                    onClick={onClose}
                                    disabled={loading || success}
                                >Cancel</Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={onDone}
                                    disabled={!success}
                                >Done</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>

        </EditDialog>
    );
}

export default ContactUpload;

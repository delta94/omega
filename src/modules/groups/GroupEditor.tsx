import React from 'react';
import * as yup from "yup";
import {reqString} from "../../data/validations";
import {FormikActions} from "formik";
import Grid from "@material-ui/core/Grid";
import XForm from "../../components/forms/XForm";
import XTextInput from "../../components/inputs/XTextInput";

import {remoteRoutes} from "../../data/constants";
import {post, put} from "../../utils/ajax";
import Toast from "../../utils/Toast";
import {GroupPrivacy, IGroup} from "./types";
import XSelectInput from "../../components/inputs/XSelectInput";
import {toOptions} from "../../components/inputs/inputHelpers";
import {enumToArray} from "../../utils/stringHelpers";
import {ISelectOpt, XRemoteSelect} from "../../components/inputs/XRemoteSelect";

interface IProps {
    data?: Partial<IGroup>
    isNew: boolean
    onGroupAdded?: (g: any) => any
    onGroupEdited?: (g: any) => any
}

const schema = yup.object().shape(
    {
        name: reqString,
        privacy: reqString,
        details: reqString,
        category: yup.object().required()
    }
)

const GroupEditor = ({data, isNew, onGroupAdded, onGroupEdited}: IProps) => {


    function handleSubmit(values: any, actions: FormikActions<any>) {
        const toSave: IGroup = {
            ...data,
            name: values.name,
            details: values.details,
            privacy: values.privacy,
            category: values.category.id,
            parent: values.parent?values.parent.id:undefined
        }
        if (isNew) {
            post(remoteRoutes.groups, toSave,
                (data) => {
                    Toast.info('Group created')
                    actions.resetForm()
                    onGroupAdded && onGroupAdded(data)
                },
                undefined,
                () => {
                    actions.setSubmitting(false);
                }
            )
        } else {
            put(remoteRoutes.groups, toSave,
                (data) => {
                    Toast.info('Group updated')
                    actions.resetForm()
                    onGroupEdited && onGroupEdited(data)
                },
                undefined,
                () => {
                    actions.setSubmitting(false);
                }
            )
        }
    }

    return (
        <XForm
            onSubmit={handleSubmit}
            schema={schema}
            initialValues={data}
        >
            <Grid spacing={1} container>
                <Grid item xs={12}>
                    <XSelectInput
                        name="privacy"
                        label="Privacy"
                        options={toOptions(enumToArray(GroupPrivacy))}
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12}>
                    <XTextInput
                        name="parent"
                        label="Parent Group"
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12}>
                    <XTextInput
                        name="name"
                        label="Name"
                        type="text"
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12}>
                    <XRemoteSelect
                        name="category"
                        label="Category"
                        remote={remoteRoutes.contactsPerson}
                        parser={({id, name}: any): ISelectOpt => ({id, label: name})}
                    />
                </Grid>
                <Grid item xs={12}>
                    <XTextInput
                        name="tag"
                        label="Tag"
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12}>
                    <XTextInput
                        name="description"
                        label="Description"
                        variant='outlined'
                        multiline
                        rowsMax="4"
                        rows={4}
                    />
                </Grid>
            </Grid>
        </XForm>
    );
}

export default GroupEditor;

import React from 'react';
import * as yup from "yup";
import {reqString} from "../../../../data/validations";
import {FormikHelpers} from "formik";
import Grid from "@material-ui/core/Grid";
import XForm from "../../../../components/forms/XForm";
import XTextInput from "../../../../components/inputs/XTextInput";
import {CompanyCategory, IContactUrl, UrlCategory} from "../../types";
import {remoteRoutes} from "../../../../data/constants";
import {useDispatch} from 'react-redux'
import {crmConstants} from "../../../../data/redux/contacts/reducer";
import {handleSubmission, ISubmission} from "../../../../utils/formHelpers";
import XSelectInput from "../../../../components/inputs/XSelectInput";
import {toOptions} from "../../../../components/inputs/inputHelpers";
import {emailCategories} from "../../../../data/comboCategories";
import {enumToArray} from "../../../../utils/stringHelpers";

interface IProps {
    contactId: string
    data: IContactUrl | null
    isNew: boolean
    done?: () => any
}

const schema = yup.object().shape(
    {
        value: reqString
    }
)

const UrlEditor = ({data, isNew, contactId, done}: IProps) => {
    const dispatch = useDispatch();
    function handleSubmit(values: any, actions: FormikHelpers<any>) {
        const submission: ISubmission = {
            url: remoteRoutes.contactsUrl,
            values:{...values,contactId}, actions, isNew,
            onAjaxComplete: (data: any) => {
                dispatch({
                    type: isNew ? crmConstants.crmAddUrl : crmConstants.crmEditUrl,
                    payload: {...data},
                })
                if (done)
                    done()
            }
        }
        handleSubmission(submission)
    }

    return (
        <XForm
            onSubmit={handleSubmit}
            schema={schema}
            initialValues={data}
        >
            <Grid spacing={0} container>
                <Grid item xs={12}>
                    <XSelectInput
                        name="category"
                        label="Category"
                        options={toOptions(enumToArray(UrlCategory))}
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12}>
                    <XTextInput
                        name="value"
                        label="Url"
                        type="text"
                        variant='outlined'
                    />
                </Grid>
            </Grid>
        </XForm>
    );
}


export default UrlEditor;

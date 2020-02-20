import React, {useEffect, useState} from 'react';
import {Box} from "@material-ui/core";
import {fakeLoan, ILoan} from "../types";
import {ContactCategory, IContact} from "../../contacts/types";
import {contactPrevHeaderCells, personPrevHeaderCells} from "../list/config";
import {intRange} from "../../../utils/numberHelpers";
import {XHeadCell} from "../../../components/table/XTableHead";
import Loading from "../../../components/Loading";
import XTable from "../../../components/table/XTable";
import {SuccessIcon} from "../../../components/xicons";
import {XStep} from "../stepper/XStepLabel";

interface IProps {
    data: ILoan
}

let headCells: XHeadCell[] = [...contactPrevHeaderCells];
const PreviousLoans = ({data}: IProps) => {
    const contact: IContact = data.applicant
    const [loading, setLoading] = useState(false);
    const [loans, setLoans] = useState<ILoan[]>([]);
    if (contact.category === ContactCategory.Person) {
        headCells = personPrevHeaderCells;
    }
    console.log("PrevLoans",headCells.length)
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            const loans = intRange(1, 4).map(fakeLoan)
            setLoans(loans)
            setLoading(false)
        }, 1000)
    }, [])
    return (
        <XStep icon={SuccessIcon} title='Previous Loans' rightLabelComponent={''} open={true}>
            {
                loading ? <Loading/> :
                    <Box p={0}>
                        <XTable
                            headCells={headCells}
                            data={loans}
                            initialRowsPerPage={3}
                            usePagination={false}
                            headerSize='small'
                            bodySize='small'
                        />
                    </Box>
            }
        </XStep>

    );
}


export default PreviousLoans;
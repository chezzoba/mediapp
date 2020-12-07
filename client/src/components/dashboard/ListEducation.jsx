import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import {del} from '../../actions/profile'


const ListEducation = ({ education, del }) => {
    const educations = education.map(exp => (
        <tr key={exp.id}>
            <td>{exp.school}</td>
            <td className="hide-sm">{exp.degree}</td>
            <td className="hide-sm">
    <Moment format="YYYY/MM/DD">{exp.from}</Moment> - {
        exp.to === null ? ' Now' : <Moment format="YYYY/MM/DD">{exp.to}</Moment>
    }
            </td>
            <td><button onClick={() => del(exp.id, false)} 
            className="btn btn-danger">Delete</button></td>
        </tr>
    ));
    return (
        <Fragment>
            <h2 className="my-2">Education Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Years</th>
                    </tr>
                </thead>
                <tbody>{educations}</tbody>
            </table>
        </Fragment>
    )
}

ListEducation.propTypes = {
    education: PropTypes.array.isRequired,
    del: PropTypes.func.isRequired
}

export default connect(null, { del })(ListEducation)

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import {del} from '../../actions/profile'


const ListExperience = ({ experience, del }) => {
    const experiences = experience.map(exp => (
        <tr key={exp.id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td className="hide-sm">
    <Moment format="YYYY/MM/DD">{exp.from}</Moment> - {
        exp.to === null ? ' Now' : <Moment format="YYYY/MM/DD">{exp.to}</Moment>
    }
            </td>
            <td><button onClick={() => del(exp.id)} 
            className="btn btn-danger">Delete</button></td>
        </tr>
    ));
    return (
        <Fragment>
            <h2 className="my-2">Experience Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                    </tr>
                </thead>
                <tbody>{experiences}</tbody>
            </table>
        </Fragment>
    )
}

ListExperience.propTypes = {
    experience: PropTypes.array.isRequired,
    del: PropTypes.func.isRequired
}

export default connect(null, { del })(ListExperience)

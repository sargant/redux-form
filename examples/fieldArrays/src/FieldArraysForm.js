import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm, change } from 'redux-form'
import validate from './validate'

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} placeholder={label}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

const renderMembers = ({ fields, meta: { touched, error } }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>Add Member</button>
      {touched && error && <span>{error}</span>}
    </li>
    {fields.map((member, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove Member"
          onClick={() => fields.remove(index)}/>
        <h4>Member #{index + 1}</h4>
        <Field
          name={`${member}.firstName`}
          type="text"
          component={renderField}
          label="First Name"/>
        <Field
          name={`${member}.lastName`}
          type="text"
          component={renderField}
          label="Last Name"/>
        <FieldArray name={`${member}.hobbies`} component={renderHobbies}/>
      </li>
    )}
  </ul>
)

const renderHobbies = ({ fields, meta: { error } }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push()}>Add Hobby</button>
    </li>
    {fields.map((hobby, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove Hobby"
          onClick={() => fields.remove(index)}/>
        <Field
          name={hobby}
          type="text"
          component={renderField}
          label={`Hobby #${index + 1}`}/>
      </li>
    )}
    {error && <li className="error">{error}</li>}
  </ul>
)

const setValueSetA = (changeHandler) => () =>
  changeHandler('members', [
    { firstName: 'Joe', lastName: 'Bloggs' },
    { firstName: 'Jane', lastName: 'Doe' }
  ])

const setValueSetB = (changeHandler) => () =>
  changeHandler('members', [
    { firstName: 'Alice', lastName: 'Smiths' },
    { firstName: 'Alex', lastName: 'Evans' },
    { firstName: 'Joe', lastName: 'Jones' }
  ])

const FieldArraysForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="clubName" type="text" component={renderField} label="Club Name"/>
      <FieldArray name="members" component={renderMembers}/>
      <div>
        <button type="button" onClick={setValueSetA(props.change)}>Value set A</button>
        <button type="button" onClick={setValueSetB(props.change)}>Value set B</button>
      </div>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

const mapDispatchToProps = (dispatch) => ({
  change: bindActionCreators(change, dispatch)
})

export default connect(undefined, mapDispatchToProps)(reduxForm({ form: 'fieldArrays', validate })(FieldArraysForm))

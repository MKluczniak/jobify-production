const FormRow = ({ type, name, value, handleChange, labelText }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label"></label>
      {/* atribute names we also want to pass in the actual name bc this is our accesss with our event obj. */}
      {labelText || name}
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className="form-input"
      ></input>
    </div>
  )
}

export default FormRow

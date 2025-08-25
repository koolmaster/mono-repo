interface PageProps {
  sdk: any
}

function Payments({ sdk }: PageProps) {
  const handlePayment = () => {
    console.log('Processing payment...', sdk)
  }

  return (
    <div className="payments-page">
      <h2>💰 Process Payment</h2>
      <div className="payment-form">
        <div className="form-group">
          <label>Amount</label>
          <input type="number" placeholder="Enter amount" />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select>
            <option>USD</option>
            <option>EUR</option>
            <option>VND</option>
          </select>
        </div>
        <button onClick={handlePayment} className="btn-primary">
          Process Payment
        </button>
      </div>
    </div>
  )
}

export default Payments

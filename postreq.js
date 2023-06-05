fetch('http://localhost:5000', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ data: 'hiii' })
})
  .then(response => {
    // Handle response
  })
  .catch(error => {
    // Handle error
  });
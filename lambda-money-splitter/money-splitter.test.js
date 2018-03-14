const handler = require('./money-splitter');

test('expected response is correct', (done) => {
  const request = {
    body: JSON.stringify({
      data: {
        people: [
          { name: 'Alice', expenses: [200, 200] },
          { name: 'Eve', expenses: [200, 200] },
          { name: 'Pete', expenses: [] }
      ]}
    })
  };
  const exp_res = JSON.stringify({ amount: 266.67,
    Pete: [
      { to: 'Alice', amount: 133.33 },
      { to: 'Eve', amount: 133.33 },
    ]
  });

  return  new Promise((resolve) => {
    handler.handler(request, null, function callback(err, res) {
      resolve(res);
    });
  }).then((res => {
    expect(res.body).toBe(exp_res);
    done();
  }));
});

test('expected response is correct', done => {
  const request = {
    body: JSON.stringify({
      data: {
        people: [
          { name: 'Alice', expenses: [] },
          { name: 'Eve', expenses: [] },
          { name: 'Pete', expenses: [200] }
      ]}
    })
  };
  const exp_res = JSON.stringify({ amount: 66.67,
    Alice: [{ to: 'Pete', amount: 66.67 }],
    Eve: [{ to: 'Pete', amount: 66.66 }]
  });

  return  new Promise((resolve) => {
    handler.handler(request, null, function callback(err, res) {
      resolve(res);
    });
  }).then((res => {
    expect(res.body).toBe(exp_res);
    done();
  }));
});

test('expected error message received', done => {
  const request = { body: JSON.stringify({ dataa: {} })};
  const exp_res = JSON.stringify({ message: 'Incorrect request body.' });
  function callback(res) {
    expect(res).toBe(exp_res);
    done();
  }
  return  new Promise((resolve) => {
    handler.handler(request, null, function callback(err, res) {
      resolve(err);
    });
  }).then((err => {
    expect(err.body).toBe(exp_res);
    done();
  }));
});

test('expected error message received', done => {
  const request = { body: JSON.stringify({ data: { people: []} })};
  const exp_res = JSON.stringify({ message: 'Incorrect request body.' });
  function callback(res) {
    expect(res).toBe(exp_res.body);
    done();
  }
  return  new Promise((resolve) => {
    handler.handler(request, null, function callback(err, res) {
      resolve(err);
    });
  }).then((err => {
    expect(err.body).toBe(exp_res);
    done();
  }));
});

test('expected error message received', done => {
  const request = { body: JSON.stringify({ data: { people: [{ name: 'Alice', expeenses: [] }]} })};
  const exp_res = JSON.stringify({ message: 'Incorrect request body.' });
  function callback(res) {
    expect(res).toBe(exp_res.body);
    done();
  }
  return  new Promise((resolve) => {
    handler.handler(request, null, function callback(err, res) {
      resolve(err);
    });
  }).then((err => {
    expect(err.body).toBe(exp_res);
    done();
  }));
});

test('expected error message received', done => {
  const request = { body: JSON.stringify({ data: { peoplee: [{ name: 'Alice', expenses: [] }]} })};
  const exp_res = JSON.stringify({ message: 'Incorrect request body.' });
  function callback(res) {
    expect(res).toBe(exp_res.body);
    done();
  }
  return  new Promise((resolve) => {
    handler.handler(request, null, function callback(err, res) {
      resolve(err);
    });
  }).then((err => {
    expect(err.body).toBe(exp_res);
    done();
  }));
});

test('expected error message received', done => {
  const request = { body: JSON.stringify({ data: { people: [
      { name: 'Alice', expenses: [100, -100] }
    ]}
  })};
  const exp_res = JSON.stringify({ message: 'All expenses must be positive numbers.' });
  function callback(res) {
    expect(res.body).toBe(exp_res);
    done();
  }

  return  new Promise((resolve) => {
    handler.handler(request, null, function callback(err, res) {
      resolve(err);
    });
  }).then((err => {
    expect(err.body).toBe(exp_res);
    done();
  }));
});

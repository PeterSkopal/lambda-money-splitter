handler = require('./handler.js');

postReq = {
    body: JSON.stringify({
        data: {
          people: [{
              name: 'Alice',
              expenses: [5000]
            },
            {
              name: 'Eve',
              expenses: [5000]
            },
            {
              name: 'Pete',
              expenses: [0]
            },
            {
              name: 'Victoria',
              expenses: [5000, 466.5]
            }
        ]}
    })
};

handler.handler(postReq, null, callback);

function callback(err, res) {
    if (err) {
        console.error(err);
    } else {
        console.log("\nResponse:\n", JSON.parse(res.body));
    }
}
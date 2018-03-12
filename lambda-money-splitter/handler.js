"use strict"

exports.handler = (event, context, callback) => {
    try {
        const data = JSON.parse(event.body).data;
        const sum_reducer = (accumulator, currentValue) => accumulator + currentValue;
        let total_expenses = 0;
        data.people.forEach(person => {
            if (person.expenses.length > 0) {
                total_expenses += person.expenses.reduce(sum_reducer);
            }
        });

        var money_adjustments = {}; // if negative, person owes money
        const split_amount = total_expenses / data.people.length;

        data.people.forEach(p => {
            if (p.expenses.length > 0) {
                var sum = p.expenses.reduce(sum_reducer);
                money_adjustments[p.name] = sum - split_amount;
            } else {
                money_adjustments[p.name] = -split_amount;
            }
        });

        var transactions = [];
        var i = 0;
        while (i < data.people.length) {
            const current_person = data.people[i];
            if (money_adjustments[current_person.name] < 0) {
                var maximum_debt = 0;
                var pay_to = '';
                data.people.forEach(p1 => {
                    if (maximum_debt < money_adjustments[p1.name]) {
                        pay_to = p1.name;
                        maximum_debt = money_adjustments[p1.name];
                    }
                });

                var diff = Math.abs(money_adjustments[pay_to]);
                money_adjustments[pay_to] -= diff;
                money_adjustments[current_person.name] += diff;
                transactions.push({
                    from : current_person.name,
                    to : pay_to,
                    amount : diff
                });
            } else {
                i++;
            }
            
        }
    } catch (err) {
        console.error(err);
        callback(err, undefined);
    }

    var response = {
        "statusCode": 200,
        "body": JSON.stringify(transactions),
        "isBase64Encoded": false
    };

    callback(undefined, response);
}

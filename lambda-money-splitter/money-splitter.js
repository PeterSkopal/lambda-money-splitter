"use strict"

exports.handler = (event, context, callback) => {
    try {
        const data = JSON.parse(event.body).data;
        if (!data || !data.people || data.people.length === 0) {
            throw 'Incorrect request body.'
        }
        data.people.forEach(person => {
            if (!person.name || !person.expenses)
                throw 'Incorrect request body.'
        });
        const sum_reducer = (accumulator, currentValue) => {
            if (currentValue <= 0)
                throw 'All expenses must be positive numbers.';
            return accumulator + currentValue;
        };
        const round = (value) => Math.round(value * 100) / 100;
        let total_expenses = 0;
        data.people.forEach(person => {
            if (person.expenses.length > 0) {
                total_expenses += person.expenses.reduce(sum_reducer);
            }
        });

        var money_adjustments = {}; // if negative, person owes money
        const split_amount = round(total_expenses / data.people.length);

        data.people.forEach(p => {
            if (p.expenses.length > 0) {
                var sum = p.expenses.reduce(sum_reducer);
                money_adjustments[p.name] = round(sum - split_amount);
            } else {
                money_adjustments[p.name] = round(-split_amount);
            }
        });

        var transactions = { amount: split_amount };
        var i = 0;
        while (i < data.people.length) {
            const current_person = data.people[i];
            if (Math.round(money_adjustments[current_person.name]) < 0) {
                var maximum_debt = 0;
                var pay_to = '';
                data.people.forEach(p1 => {
                    if (maximum_debt < money_adjustments[p1.name]) {
                        pay_to = p1.name;
                        maximum_debt = money_adjustments[p1.name];
                    }
                });

                var diff = money_adjustments[pay_to] > split_amount ? split_amount : Math.abs(money_adjustments[pay_to]);
                money_adjustments[pay_to] = round(money_adjustments[pay_to] - diff);
                money_adjustments[current_person.name] = round(money_adjustments[current_person.name] + diff);
                if (transactions[current_person.name] === undefined) {
                    transactions[current_person.name] = [];
                }
                transactions[current_person.name].push({
                    to : pay_to,
                    amount : diff
                });
            } else {
                i++;
            }
            
        }

        var response = {
            'statusCode': 200,
            'body': JSON.stringify(transactions),
            'isBase64Encoded': false
        };
        callback(undefined, response);
    } catch (err) {
        var error_response = {
            'statusCode': 200,
            'body': JSON.stringify({message: err}),
            'isBase64Encoded': false
        }
        callback(error_response, undefined);
    }


}
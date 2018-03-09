"use strict"

exports.handler = (event, context, callback) => {
    const data = event.data;
    const sum_reducer = (accumulator, currentValue) => accumulator + currentValue;
    let total_expenses = 0;
    data.people.forEach(person => {
        if (person.expenses.length > 0) {
            total_expenses += person.expenses.reduce(sum_reducer);
        }
    });

    var money_adjustments = {};
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

    data.people.forEach(p => {
        if (money_adjustments[p.name] > 0) {
            var maximum_debt = 0;
            var person_paying = '';
            data.people.forEach(p1 => {
                if (maximum_debt > money_adjustments[p1.name]) {
                    person_paying = p1.name;
                    maximum_debt = money_adjustments[p1.name];
                }
            });

            var diff = money_adjustments[p.name];
            money_adjustments[person_paying] += diff;
            money_adjustments[p.name] -= diff;
            transactions.push({
                from : person_paying,
                to : p.name,
                amount : diff
            });
            
        }
    });
    callback(undefined, {transactions: transactions});
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    let editId = null;

    function renderExpenses() {
        axios.get('http://localhost:3000/')
            .then(response => {
                const expenses = response.data;
                expenseList.innerHTML = '';
                expenses.forEach((expense) => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between';
                    li.innerHTML = `
                        ${expense.amount} - ${expense.description} - ${expense.category}
                        <div>
                            <button class="btn btn-secondary btn-sm me-2 edit-btn" data-id="${expense.id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${expense.id}">Delete</button>
                        </div>
                    `;
                    expenseList.appendChild(li);

                    // Add event listener for delete button
                    li.querySelector('.delete-btn').addEventListener('click', function () {
                        const id = this.getAttribute('data-id');
                        axios.delete(`http://localhost:3000/deleteexpense/${id}`)
                            .then(() => {
                                renderExpenses();
                            })
                            .catch(error => {
                                console.error('Error deleting expense:', error);
                            });
                    });

                    // Add event listener for edit button
                    li.querySelector('.edit-btn').addEventListener('click', function () {
                        editId = this.getAttribute('data-id');
                        const expense = expenses.find(exp => exp.id == editId);
                        document.getElementById('amount').value = expense.amount;
                        document.getElementById('description').value = expense.description;
                        document.getElementById('category').value = expense.category;
                    });
                });
            })
            .catch(error => {
                console.error('Error retrieving expenses:', error);
            });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        const newExpense = { amount, description, category };

        if (editId !== null) {
            axios.put(`http://localhost:3000/editexpense/${editId}`, newExpense)
                .then(() => {
                    editId = null;
                    form.reset();
                    renderExpenses();
                })
                .catch(error => {
                    console.error('Error updating expense:', error);
                });
        } else {
            axios.post('http://localhost:3000/addexpense', newExpense)
                .then(() => {
                    form.reset();
                    renderExpenses();
                })
                .catch(error => {
                    console.error('Error adding expense:', error);
                });
        }
    });

    renderExpenses(); // Initial rendering of expenses from server
});
const Modal = {
    openClose() {
        //abrir e fechar modal 
        //Adicionar a class active ao modal ou remove caso esteja adicionada.
        document.querySelector('.modal-overlay').classList.toggle('active');
    }

    /*
     open(){
         //abrir modal 
         //Adicionar a class active ao modal
         document.querySelector('.modal-overlay').classList.add('active');
     },
     close() {
         //fechar o modal 
         //remover a class active do modal
         document.querySelector('.modal-overlay').classList.remove('active');
     }*/
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}


const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction);

        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1);
        App.reload();

    },


    incomes() {
        let income = 0;
        // somar as entradas
        //pegar todas as transações
        Transaction.all.forEach(transaction => {
            //verificar se é maior que zero
            if (transaction.amount > 0) {
                //se for maior que zero somar e colocar dentro de uma variavel 
                income += transaction.amount;
            }

        })

        //se for maior que zero somar e colocar dentro de uma variavel 
        //retornar ela formatada


        return income;

    },

    expenses() {
        //Somar as saídas
        let expense = 0;

        //pegar todas as transações
        Transaction.all.forEach(transaction => {
            //verificar se é maior que zero
            if (transaction.amount < 0) {
                //se for maior que zero somar e colocar dentro de uma variavel 
                expense += transaction.amount;
            }

        })

        //se for maior que zero somar e colocar dentro de uma variavel 
        //retornar ela formatada


        return expense;

    },

    total() {
        // resultado entre entradas - saídas   

        balance = Transaction.incomes() + Transaction.expenses();
        return balance;
    }
}




const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {

        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr);


    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `                    
                        <td class="description">${transaction.description}</td>
                        <td class=${CSSclass}>${amount}</td>
                        <td class="date">${transaction.date}</td>
                        <td>
                            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
                        </td>                    
                     `

        return html;
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}


const Utils = {
    formatAmount(value) {        
        value = value * 100;        
       return Math.round(value);
    },

    formatDate(date) {
        const splitDate = date.split('-');
        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },



    validateFields() {
        const { description, amount, date } = Form.getValues();


        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("por favor, preencha todos os campos")
        }


    },




    /*Formatar os dados para savar*/

    formatValues() {
        let { description, amount, date } = Form.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction) {
        Transaction.add(transaction);
    },

    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },




    /*salvar
    apagar os dados do format
    modal fechar e atualizar aplicação
    */
    submit(event) {
        event.preventDefault();


        try {
            /* 
        Verificar se todas as informações foram preenchidas */
            Form.validateFields();


            /*Formatar os dados para savar*/
            const transaction = Form.formatValues();

            /*salvar 
          */

            Form.saveTransaction(transaction);

            /*
            apagar os dados do format
            
            */

            Form.clearFields();

            /*
            
            modal fechar 
            */
            Modal.openClose();




        } catch (error) {
            alert(error.message);

        }



    }



}



const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction);
        DOM.updateBalance();

        Storage.set(Transaction.all);

    },
    reload() {
        DOM.clearTransactions();
        App.init()
    },

}

App.init();






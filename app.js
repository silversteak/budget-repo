// Module pattern - Explaination , Data encapsulation, API, Private and public, API . separation of concern

//IIFI - anonymous functon // Data privacy New scope

var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
};



var budgetController = (function () {

    /* var x = 23;
     var add = function(a){
         return x + a;
     }
     
     // Power of closure. 
     return {
         publicTest: function(b){
             //console.log(add(b));
             return add(b);
         }
     }*/

    //Function Constructor
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome)*100);       
        }
        else{
            this.percentage = 1;
        }
            
        };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

    //Function Constructor 
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (curr) {
            sum = sum + curr.value;
        });
        data.total[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        //allIncomes : [];
        //allExpense : [];
        //totalExpenses : 0;
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,

    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            // [1 2 3 4 5], next ID = 6
            // id = last id + 1;

            //Create new Id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0;
            }

            //Create a new Item based on inc and exp
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push it to the data structure  
            data.allItems[type].push(newItem);

            // return the new item
            return newItem;
        },

        deleteItem: function (type, ID) {
            var index, ids;
            // ID = 3
            //Returns a brand new array 
            ids = data.allItems[type].map(function (curr) {
                return curr.id;
            });

            index = ids.indexOf(ID);
            // iD = [1 2 4 6 8] 
            // Create an array to store the indexs

            if (index !== -1) {
                // splice to remove elements
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {

            // calculate total income nd expense
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget income - expense
            data.budget = data.total.inc - data.total.exp;

            // calculate the % of income we spent
            if (data.total.inc > 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else
                data.percentage = -1;

        },
        
        calculatePercentage : function(){
            // calculate each of object indiviudually 
            
            data.allItems.exp.forEach(function(cur){
               cur.calcPercentage(data.total.inc);
            });
            
        },
        
        getPercentage : function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage,

            }
        },

        testing: function () {
            console.log(data);
        }
    };


})();



var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel : '.item__percentage',
        budgetMonthLabel : '.budget__title--month',
    }
    
    // Some code later
    return {
        getInput: function () {

            return {
                type: document.querySelector(DOMstrings.inputType).value, // wile either inc or exp
                decription: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),

            };

        },

        addListItem: function (obj, type) {

            var html, newHtml, element;

            // Crete HTML String with placeHolder file
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div</div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the data into the UI

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);



        },

        //Delete the list from the dom using ID
        
        deleteListItem: function (selectorID) {
            var element;
            element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },


        clearFields: function () {
            var fields, fieldArr;
            //Returns a list not an array
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldArr[0].focus();

        },


        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLable).textContent = '--';
            }



        },
        
        displayPercentages : function(percentages){
            //returns the nodeList 
            var fields = document.querySelectorAll(DOMstrings.expensePercentageLabel);
            
            //NodeListForEach Future reference 
            var nodeListForEach = function(list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };
            
            nodeListForEach(fields, function(cur, index){
                if(percentages[index] > 0){
                    cur.textContent = percentages[index] + "%";    
                }else{
                    cur.textContent = '--';
                }
                
            })
            
            
        },
        
        displayMonth : function(){
            var now, year, month
            
            now = new Date();
            
            year = now.getFullYear();
            month = now.getMonth()
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(DOMstrings.budgetMonthLabel).textContent =months[month] +' '+ year;
            
        },

        getDOMstring: function () {
            return DOMstrings;
        }
    }

})();




var appController = (function (budgetCrtl, UICtrl) {

    /*var z = budgetCrtl.publicTest(5);
    
    return {
        anotherPrint : function(){
             console.log("This is me" + " " + z);
        }
    }
    */
    
    var setupEventListener = function () {

        var DOM = UICtrl.getDOMstring();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        // KeyEnter Using event argrument
        document.addEventListener('keypress', function (event) {
            //console.log(event);
            if (event.keyCode === 13) {
                //console.log("Enter was pressed");
                ctrlAddItem();
            }

        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function () {
        //4. Calculate the budget
        budgetCrtl.calculateBudget();
        //Returns the budget
        var budget = budgetCrtl.getBudget();
        //5. Display the budget on the UI
        console.log(budget);
        //console.log("It Works"); 
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentage = function(){
        //Calculate percentages
        budgetCrtl.calculatePercentage()
        //Read percentages from budget controller
        var percentages = budgetCrtl.getPercentage();
        //update the UI with the new percentages
        //console.log(percentages);
        UICtrl.displayPercentages(percentages);
    
    };



    var ctrlAddItem = function () {
        var input, newItem;
        //console.log("Button was clicked"); 
        //1. Get the input Data
        input = UICtrl.getInput();
        //console.log(input);

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget Cantroller
            newItem = budgetCrtl.addItem(input.type, input.decription, input.value);
            //3. Add item to the UI
            UICtrl.addListItem(newItem, input.type);
            //Clear the values
            UICtrl.clearFields();
            //Calculate Budget
            updateBudget();
            //Update percentages
            updatePercentage();

        }


    };

    var ctrlDeleteItem = function (event) {
        var itemId, splitID, type, ID;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {

            //inc-1 exp-1
            splitID = itemId.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            //console.log(type);
            //console.log(ID);

            // Deelete the item form the data structure
            budgetCrtl.deleteItem(type, ID);
            // delete the item from the UI
            UICtrl.deleteListItem(itemId);

            //Update and show the new budget
            updateBudget();
            
            //Update the percentages
            updatePercentage();

        }
    }

    return {
        init: function () {
            console.log("Application has started");
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            })
            setupEventListener();
        }
    };


})(budgetController, UIController);

appController.init();

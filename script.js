'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(movements, sort = 
  false) {

  containerMovements.innerHTML = '';

const movs = sort ? movements.slice().sort((a,b) => a- b): movements;

movs.forEach(function(mov, i){
  const type = mov > 0 ? 'deposit' : 'withdrawal';

   const html = `
   <div class="movements__row">
          <div class="movements__type
           movements__type--${type}">${
             i+1
            } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
   `;
   containerMovements.insertAdjacentHTML(
     'afterbegin', html);
 });
};




const calcPrintDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov)=>acc+mov,0);
  labelBalance.textContent=`${acc.balance} EUR`;
};

const calcDisplaySummary = function(acc){
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc+mov, 0);
  labelSumIn.textContent = `${incomes}`;

  const outcomes = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc+mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}`;

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate)/100)
  .filter((int, i, arr) =>{
    console.log(arr);
    return int >=1;
  })
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}`;

};



const user = 'Steven Thomas Williams';
const createUserNames = function(accs){
  accs.forEach(function(acc){
     acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  });

};

createUserNames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcPrintDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
}

// Event handler
let currentAccount;

btnLogin.addEventListener('click', function(e){
  //Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.
    value);
    console.log(currentAccount);

    if(currentAccount?.pin === Number(inputLoginPin.value)){
      //Display UI and welcome message
      labelWelcome.textContent=`Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;
      containerApp.style.opacity = 100;

      //Clear input fields
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();

       // Update UI
       updateUI(currentAccount);
   
    }
});

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username===inputTransferTo.value
  );


  if(amount > 0 && 
    receiverAcc 
    &&currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username)
    {
      //Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      
       // Update UI
       updateUI(currentAccount);

    }
});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    //Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  if(
    inputCloseUsername.value===currentAccount.
    username&&Number(inputClosePin.value)===currentAccount.pin)
  {
    const index = accounts.findIndex(
      acc=>acc.username ===currentAccount.username);
      console.log(index);
      //Delete account
    accounts.splice(index,1);

    //Hide UI
    containerApp.style.opacity = 0;

  }
  inputTransferAmount.value=inputTransferTo.value='';
});


let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});



const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// createUserNames(accounts);
// console.log(accounts);

// const deposits = movements.filter(function (mov){
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const withdrawals = movements.filter(function (mov){
//   return mov < 0;
// });

// console.log(withdrawals);

// const balance = movements.reduce((acc, curr)=> acc+curr, 0);
// console.log(balance);

// const max = movements.reduce((acc, mov)=> {
//   if(acc > mov)
//   return acc;
//   else return mov;
// }, movements[0]);

// console.log(max);




/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


///////////////////////////////////////////

// let arr =['a', 'b', 'c', 'd', 'e'];

// ///Slice
// console.log(arr.slice(2));
// console.log(arr.slice(2,4));
// console.log(arr.slice(1,-2));

// console.log(arr.slice()); //copy

// //Splice
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1,2);
// console.log(arr);

// arr =['a', 'b', 'c', 'd', 'e'];
// ////reverse
// const arr2 =['j','i','h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //concat
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

///join
// console.log(letters.join('-'));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for(const [i, movement] of movements.entries()){
//   if(movement > 0){
//     console.log(`Movement ${i+1}: you deposited ${movement}`);
//   }else {
//     console.log(`Movement ${i+1}: you withdrew ${Math.abs(movement)}`);
//   };
// };
// console.log('----FOREACH---------------');
// movements.forEach(function(movement, i) {
//   if(movement > 0){
//     console.log(`Movement ${i+1}: you deposited ${movement}`);
//   }else {
//     console.log(`Movement ${i+1}: you withdrew ${Math.abs(movement)}`);
//   };
// });

// ////MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function(value,key,map){
//   console.log(`${key}: ${value}`);
// });

// ////SET 
// const currecxiesUnique = new Set(['USD', 'EUR', 'EUR']);
// currecxiesUnique.forEach(function(value, key, map){
//   console.log(`${key}: ${value}`);
// });

// const euroToUsd = 1.1;

// const movementsUSD = movements.map( (mov) =>  
// mov*euroToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDFor= [];
// for(const mov of movements) movementsUSDFor.push(mov*
//   euroToUsd);

// console.log(movementsUSDFor);

// const movementsDescriptions = movements.map(
//   (mov,i) =>
//   `Movement ${i+1}: You ${mov > 0 ? 'deposited': 'withdrew'} ${Math.abs(mov)}`
// );

// console.log(movementsDescriptions);

// const account = accounts.find(acc => acc.owner==='Jessica Davis');
// console.log(account);

// const accounT = [];
// for(const acc of accounts)accounT.push(acc.owner==='Jessica Davis') ;
// console.log(accounT);









/////CHALLENGE 1
/*/////////////////////////////

// const checkDogs = function(dogsJulia, dogsKate){

//   const correctedDogsJulia = dogsJulia.slice(1,-2);
//   const correctedDogsKate = dogsKate.slice();
  
//   const dogsJuliaKate = [...correctedDogsJulia, ...correctedDogsKate];

//   dogsJuliaKate.forEach(function(age, i){
//     if(age >= 3){
//     console.log(`Dog number ${i+1} is an adult, and ${age} years old `);
//     }else{
//       console.log(`Dog number ${i+1} is still a puppy`);
//     };
//   });
//   console.log(dogsJuliaKate);
// };

// checkDogs([3,5,2,12,7],[4,1,15,8,3]);
// checkDogs([9,16,6,8,3], [10,5,6,1,4]);


*//////////////////////////////
/////CHALLENGE 2
//////////////////////

// const calcAverageHumanAge = function(ages){
//   const humanAge = ages.map(dogAge => 
//     (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4));


//    const adults = humanAge.filter(age => (age >= 18));
//    console.log(humanAge);
//    console.log(adults);

//    const average = adults.reduce((acc, age) => acc+
//    age, 0)/adults.length;
//    console.log(average);

// };

// calcAverageHumanAge([5,2,4,1,15,8,3]);
// calcAverageHumanAge([16,6,10,5,6,1,4]);


/////////////////////////
//////CHALLENGE 3

// const calcAverageHumanAge = function(ages){
//   const humanAge = ages.map(dogAge => 
//     (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4));


//    const adults = humanAge.filter(age => (age >= 18));
//    console.log(humanAge);
//    console.log(adults);

//    const average = adults.reduce((acc, age) => acc+
//    age, 0)/adults.length;
//    console.log(average);

// };

////CHAINING

// const calcAverageHumanAge2 = ages => ages.map(dogAge => 
//   (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
//   .filter(age => (age >= 18))
//   .reduce((acc, age, i, arr) => acc+
//    age/arr.length,0
//    );


// const avg1 = calcAverageHumanAge2([5,2,4,1,15,8,3]);
// const avg2 = calcAverageHumanAge2([16,6,10,5,6,1,4]);

// console.log(avg1, avg2);

//SOME: CONDITION
// console.log(movements.some(mov=> mov === -130));

// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// // EVERY
// console.log(movements.every(mov=> mov >0));
// console.log(account4.movements.every(mov=>mov>0));

// //SEparate callback
// const deposit = mov => mov >0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));


// //flat method
// const arr = [[1,2,3], [4,5,6], 7,8];
// console.log(arr.flat());

// const arrDeep = [[[1,2],3], [4,[5,6]], 7,8];
// console.log(arrDeep.flat(2));


// const overalBalance = accounts
// .map(acc=>acc.movements)
// .flat()
// .reduce((acc,mov)=>acc + mov, 0);


// console.log(overalBalance);

// //flatmap

// const overalBalance2 = accounts
// .flatMap(acc => acc.movements)
// .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);

// //Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// //Numbers
// console.log(movements);

//return < 0, A, B (keep order)
//return > 0, B , A ( switch order)

//Ascending
// movements.sort((a,b) =>{
//   if (a>b)
//   return 1;
//   if (b>a)
//   return -1;
// });

// movements.sort((a,b) => a-b);
// console.log(movements);

//Descending
// movements.sort((a,b) =>{
//   if (a>b)
//   return -1;
//   if (b>a)
//   return 1;
// });

// movements.sort((a,b) => b-a);
// console.log(movements);

const arr = [1,2,3,4,5,6,7]
console.log(new Array(1,2,3,4,5,6,7));

const x = new Array(7);
console.log(x);

// console.log(x.map(() =>5));

// x.fill(1);
// console.log(x);

x.fill(1,3,5);
console.log(x);

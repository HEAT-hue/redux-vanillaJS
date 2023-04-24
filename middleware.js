// Import the redux library
const redux = require("redux");

// Configure the store
const createStore = redux.legacy_createStore;

// Bind action creators to store,dsipatch
// const bindActionCreators = redux.bindActionCreators;

// Combine reducers into a root reducer
const combineReducers = redux.combineReducers;

// Apply middlewares in store
const applyMiddleware = redux.applyMiddleware;

// Require immer library for state mutation
const produce = require("immer").produce;

// Apply logger middleware for logging actions to the console
const reduxLogger = require("redux-logger");
const logger = reduxLogger.createLogger();

// Define the actions types
const ACTIONS = {
  CAKE_ORDERED: "CAKE_ORDERED",
  CAKE_RESTOCKED: "CAKE_RESTOCKED",
  ICECREAM_ORDERED: "ICECREAM_ORDERED",
  ICECREAM_RESTOCKED: "ICECREAM_RESTOCKED",
};

/* Define the action creators - this will return an action */
function orderCake(qty = 1) {
  return {
    type: ACTIONS.CAKE_ORDERED,
    payload: { qty },
  };
}
function restockCake(qty = 10) {
  return {
    type: ACTIONS.CAKE_RESTOCKED,
    payload: { qty },
  };
}
function orderIcecream(qty = 1) {
  return {
    type: ACTIONS.ICECREAM_ORDERED,
    payload: { qty },
  };
}
function restockIcecream(qty = 1) {
  return {
    type: ACTIONS.ICECREAM_RESTOCKED,
    payload: { qty },
  };
}

const initialCakeState = {
  numberOfCakes: 10,
};

const initialIcecreamState = {
  numOfIcecreams: 20,
};

// Create the reducer to update the state based on the action
const cakeReducer = (state = initialCakeState, action) => {
  switch (action.type) {
    case ACTIONS.CAKE_ORDERED: {
      const { qty } = action.payload;

      //   Return mutable state via immer produce function
      return produce(state, (draft) => {
        // draft points to local copy of state
        draft.numberOfCakes = draft.numberOfCakes - qty;
      });
    }

    case ACTIONS.CAKE_RESTOCKED: {
      const { qty } = action.payload;
      console.log("About to restock cakes");
      return { ...state, numberOfCakes: state.numberOfCakes + qty };
    }

    default: {
      return state;
    }
  }
};
// Create the reducer to update the state based on the action
const icecreamReducer = (state = initialIcecreamState, action) => {
  switch (action.type) {
    case ACTIONS.ICECREAM_ORDERED: {
      const { qty } = action.payload;
      return { ...state, numOfIcecreams: state.numOfIcecreams - qty };
    }
    case ACTIONS.ICECREAM_RESTOCKED: {
      const { qty } = action.payload;
      console.log("About to restock cakes");
      return { ...state, numOfIcecreams: state.numOfIcecreams + qty };
    }
    default: {
      return state;
    }
  }
};

// Combine reducers into root reducer with an identifier used to refer to each reducer
const rootReducer = combineReducers({
  cake: cakeReducer,
  icecream: icecreamReducer,
});

// Configure the store, to expose functions - getState | suscribe | dispatch | replaceReducer
const store = createStore(rootReducer, applyMiddleware(logger));
// console.log(store);

// Get current state from store at any time you wish
const state = store.getState();
console.log("Initial state of our application");
console.log(state);

// subscribe to store updates by registering listners, callback function run anytime a state change was detected
const unsuscribe = store.subscribe(() => {
  //   console.log("State change detected");
  //   console.log(store.getState());
});

// Dispatch actions via action creators to update state - this is the only way to update state
store.dispatch(orderCake(2));
store.dispatch(orderCake(2));
store.dispatch(orderCake(2));
store.dispatch(restockCake());
store.dispatch(orderIcecream(2));
store.dispatch(orderIcecream(2));
store.dispatch(orderIcecream(2));
store.dispatch(restockIcecream());

// Bind action creators
// const actions = bindActionCreators({ orderCake, restockCake }, store.dispatch);

// Call the action creator
// actions.orderCake();
// actions.orderCake();
// actions.orderCake();
// actions.restockCake();

// unsuscribe();
// store.dispatch(orderCake());

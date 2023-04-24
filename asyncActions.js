const redux = require("redux");
const createStore = redux.legacy_createStore;
const applyMiddleware = redux.applyMiddleware;
const thunkMiddleware = require("redux-thunk").default;

// Apply logger middleware for logging actions to the console
const reduxLogger = require("redux-logger");
const logger = reduxLogger.createLogger();

const axios = require("axios");

const initialState = {
  loading: false,
  users: [],
  error: "",
};

// Define action
const ACTIONS = {
  FETCH_USERS_REQUESTED: "FETCH_USERS_REQUESTED",
  FETCH_USERS_SUCCEEDED: "FETCH_USERS_SUCCEEDED",
  FETCH_USERS_FAILED: "FETCH_USERS_FAILED",
};

const fetchUsersRequest = () => {
  return {
    type: ACTIONS.FETCH_USERS_REQUESTED,
  };
};

const fetchUsersSuccess = (users) => {
  return {
    type: ACTIONS.FETCH_USERS_SUCCEEDED,
    payload: { users },
  };
};

const fetchUsersFailure = (error) => {
  return {
    type: FETCH_USERS_FAILED,
    payload: { error },
  };
};

// Define reducer function
const asyncReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_USERS_REQUESTED: {
      return { ...state, loading: true };
    }

    case ACTIONS.FETCH_USERS_SUCCEEDED: {
      const { users } = action.payload;
      return { ...state, users, loading: false, error: "" };
    }

    case ACTIONS.FETCH_USERS_FAILED: {
      const { error } = action.payload;
      return { ...state, users: [], loading: false, error };
    }
  }
};

// Define async action creator
const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUsersRequest());
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        // response.data is the users
        const users = response.data.map((user) => user.id);
        dispatch(fetchUsersSuccess(users));
      })
      .catch((error) => {
        // error.message is the error message
        dispatch(fetchUsersFailure(error.message));
      });
  };
};

const store = createStore(
  asyncReducer,
  applyMiddleware(thunkMiddleware, logger)
);

store.dispatch(fetchUsers());

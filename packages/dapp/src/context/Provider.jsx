import { createContext, useRef } from 'react'

//Initial State and Actions
// const initialState = {
//   todoList: [],
//   user: {} // address, balances: { NFTs: {}, Tokens: {} }
// };

// const actions = {
//   USER_ACCOUNT: "USER_ACCOUNT",
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case actions.ADD_TODO_ITEM:
//       return {
//         todoList: [
//           ...state.todoList,
//           {
//             id: new Date().valueOf(),
//             label: action.todoItemLabel,
//             completed: false
//           }
//         ]
//       };
//     case actions.REMOVE_TODO_ITEM: {
//       const filteredTodoItem = state.todoList.filter(
//         (todoItem) => todoItem.id !== action.todoItemId
//       );
//       return { todoList: filteredTodoItem };
//     }
//     case actions.TOGGLE_COMPLETED: {
//       const updatedTodoList = state.todoList.map((todoItem) =>
//         todoItem.id === action.todoItemId
//           ? { ...todoItem, completed: !todoItem.completed }
//           : todoItem
//       );
//       return { todoList: updatedTodoList };
//     }
//     default:
//       return state;
//   }
// };

//Context and Provider
export const MainContext = createContext();

export function Provider({ children }) {

  // i can create any state that i want here with useState and just pass in the value and the updater or use the lean redux method

  // const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    // todoList: state.todoList,
    message: 'i can pass around the data with context now',
    // addTodoItem: (todoItemLabel) => {
    //   dispatch({ type: actions.ADD_TODO_ITEM, todoItemLabel });
    // },
    // removeTodoItem: (todoItemId) => {
    //   dispatch({ type: actions.REMOVE_TODO_ITEM, todoItemId });
    // },
    // markAsCompleted: (todoItemId) => {
    //   dispatch({ type: actions.TOGGLE_COMPLETED, todoItemId });
    // }
  };

  return (
    <MainContext.Provider value={value}>
      {children}
    </MainContext.Provider>
  );
};

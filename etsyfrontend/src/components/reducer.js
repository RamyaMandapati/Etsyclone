export const initialState={
    basket: ["food","chicken"],
    user: null,
};

function reducer(state, action){
    console.log(action);
    switch(action.type){
        case 'ADD_TO_CART':
            return {
                ...state,
                basket: [...state.basket,action.item]
        };
            
        case 'REMOVE_FROM_CART':
            return {state}
            break;
        default:
            return state;


    }
};
export default reducer

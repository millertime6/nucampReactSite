import * as ActionTypes from './ActionTypes';
import { PARTNERS } from '../shared/partners';

export const Partners = (state = { errMess: null, PARTNERS}, action) => {
    
    switch (action.type) {
        case ActionTypes.ADD_PARTNERS:
            return {...state, errMess: null, partners: action.payload};

        case ActionTypes.PARTNERS_FAILED:
            return {...state, errMess: action.payload};

        case ActionTypes.ADD_COMMENT:
            const partners = action.payload;
            return {...state, partners: state.partners.concat(partners)};
        default:
          return state;
      }
};
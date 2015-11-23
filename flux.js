let areAllPropsFuncs = function(obj) {
  let isGood = false;
  
  if (_.isObject(obj)) {
    isGood = true;
    _.each(obj, (value, key) => {
      if (!_.isFunction(value)) {
        isGood = false;
      }
    })  
  }

  return isGood;
};


class ReactiveStore {
  constructor(storeName) {
    this._storeName = storeName;
    this._storeState = new ReactiveDict(storeName);
    this._actions = {};
    this._reactiveDataSources = {};
  }

  get(keyName) {
    let source = this._reactiveDataSources[keyName];
    if(source && typeof source === 'function') {
      return source();
    } else {
      return this._storeState.get(keyName);  
    }
  }

  equals(keyName, value) {
    return this._storeState.equals(keyName, value);
  }

  dataSources(obj) {
    if(areAllPropsFuncs(obj)) {
      _.extend(this._reactiveDataSources, obj);  
    } else {
      console.warn(`You must pass an object to ${this._storeName}.dataSources with all props of type function.`);
    }
  }

  methods(obj) {
    if (areAllPropsFuncs) {
      _.extend(this._actions, obj);  
    } else {
      console.warn(`You must pass an object to ${this._storeName}.methods with all props of type function.`);
    }
  }

  call(actionName, ...args) {
    let self = this;
    
    const methodNotFound = (methodName) => {
      let store = this._storeName;
      console.warn(`${methodName} is not a defined method on ${store}. Add it to ${store}.methods()`);
      return;
    };

    // make sure it's called with an actionName
    if(typeof actionName !== 'string') return console.warn(`You forgot to pass a method name to ${this._storeName}.call()`);
    // make sure there are actions
    if (!this._actions) return methodNotFound(actionName);
    // make sure the desired action exists
    let action = this._actions[actionName];
    if(!action) return methodNotFound(actionName); 

    let context = {
      setState: function() {
        return self._storeState.set.apply(self._storeState, arguments);
      },
      state: self._storeState.all()
    };

    return action.apply(context, args);
  }
}

Store = ReactiveStore;

// Write your tests here!
Tinytest.add('creatingAndCallingMethods', function (test) {
  let MyStore = new Store();
  
  test.equal(!!MyStore.methods, true);
  test.equal(!!MyStore.call, true);
  test.equal(Object.keys(MyStore._actions).length, 0);

  MyStore.methods({
    'SOMETHING_HAPPENED': function(bool) {
      this.setState('didSomethingHappen', bool);
      return this.state;
    },
    'SOMETHING_ELSE_HAPPENED': function(bool) {
      this.setState({'didSomethingHappen': bool});
      return this.state;
    }
  });

  test.equal(Object.keys(MyStore._actions).length, 2);

  
  test.equal(MyStore.get('didSomethingHappen'), undefined);
  let stateReturnValue = MyStore.call('SOMETHING_HAPPENED', true);
  
  test.equal(Object.keys(stateReturnValue).length, 0);
  test.equal(MyStore.get('didSomethingHappen'), true);

  stateReturnValue = MyStore.call('SOMETHING_ELSE_HAPPENED', false);
  test.equal(stateReturnValue.didSomethingHappen, true);
  test.equal(MyStore.get('didSomethingHappen'), false);
});

Tinytest.add('methodNotFound', function(test) {
  let MyStore = new Store();
  MyStore.methods({
    'RETURNS_TRUE': function() {
      return true;
    },
  });

  let oldWarn = console.warn;
  let message = null;
  console.warn = function(arg) {
    message = arg;
  };
  test.equal(MyStore.call('RETURNS_TRUE'), true);
  MyStore.call('BOGUS_METHOD');
  test.equal(message, `BOGUS_METHOD is not a defined method on undefined. Add it to undefined.methods()`);
  message = null;

  MyStore.call(true);
  test.equal(message, 'You forgot to pass a method name to undefined.call()');
  message = null;

  MyStore.call();
  test.equal(message, 'You forgot to pass a method name to undefined.call()');
  message = null;

  console.warn = oldWarn;
});

Tinytest.add('addingDataSources', function(test) {
  let DataSourcesStore = new Store();
  test.equal(!!DataSourcesStore.dataSources, true);
  test.equal(Object.keys(DataSourcesStore._reactiveDataSources).length, 0);
  DataSourcesStore.dataSources({
    'MyFirstDataSource': function() {}
  });
  test.equal(Object.keys(DataSourcesStore._reactiveDataSources).length, 1);
  DataSourcesStore.dataSources({
    'MySecondDataSource': function() {}
  });
  test.equal(Object.keys(DataSourcesStore._reactiveDataSources).length, 2);
  DataSourcesStore.dataSources({
    'MySecondDataSource': function() {}
  });
  test.equal(Object.keys(DataSourcesStore._reactiveDataSources).length, 2);
});

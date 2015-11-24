Package.describe({
  name: 'woody:flux',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A Flux pattern that leverages Tracker.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/davidwoody/flux.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'reactive-dict',
    'tracker',
    'underscore'
    ]);
  api.addFiles('flux.js');
  api.export('Store');
});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'tinytest',
    'tracker',
    'underscore',
    'woody:flux'
  ]);
  api.addFiles('flux-tests.js');
});

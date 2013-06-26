(function(curl) {

	curl.config({
		paths: {
			underscore: 'components/underscore/underscore',
			jquery: 'components/jquery/jquery'
		},
		packages: {
			curl: { location: 'components/curl/src/curl' },
			when: { location: 'components/when', main: 'when' },
			meld: { location: 'components/meld', main: 'meld' },
			cola: { location: 'components/cola', main: 'cola' },
			backbone: { location: 'components/backbone', main: 'backbone' }
		}
	});

	curl(['proxy-test/main'], function(run) {
		run();
	});

}(curl));